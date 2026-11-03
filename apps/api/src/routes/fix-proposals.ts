import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { FindingSchema, type FixProposal } from "@acr/review-contracts";
import { generateFixProposal } from "@acr/agents";
import { logger } from "@acr/observability";

export const fixProposalStore = new Map<string, FixProposal>();

export const CreateFixProposalRequestSchema = z.object({
  finding: FindingSchema.extend({
    id: z.string().optional(),
  }),
  fileContent: z.string().min(1),
  validateInSandbox: z.boolean().optional(),
});

export const ApproveFixProposalRequestSchema = z.object({
  approvedBy: z.string().min(1),
});

export function createFixProposalRouter(): Router {
  const router = Router();

  // POST /api/v1/fix-proposals
  router.post("/", async (req: Request, res: Response) => {
    const parseResult = CreateFixProposalRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: "invalid_request",
        details: parseResult.error.flatten(),
      });
      return;
    }

    const { finding, fileContent, validateInSandbox } = parseResult.data;

    try {
      const proposal = await generateFixProposal(finding as any, fileContent, {
        validateInSandbox,
      });

      fixProposalStore.set(proposal.id, proposal);
      logger.info({ proposalId: proposal.id, findingId: finding.id }, "Created fix proposal");

      res.status(201).json(proposal);
    } catch (err: any) {
      logger.error({ error: err.message }, "Failed to generate fix proposal");
      res.status(422).json({
        error: "fix_generation_failed",
        message: err.message,
      });
    }
  });

  // GET /api/v1/fix-proposals/:id
  router.get("/:id", (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: "missing_id" });
      return;
    }
    const proposal = fixProposalStore.get(id);
    if (!proposal) {
      res.status(404).json({ error: "not_found", message: "Fix proposal not found" });
      return;
    }
    res.json(proposal);
  });

  // POST /api/v1/fix-proposals/:id/approve (Human-in-the-loop sign-off)
  router.post("/:id/approve", (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: "missing_id" });
      return;
    }
    const proposal = fixProposalStore.get(id);
    if (!proposal) {
      res.status(404).json({ error: "not_found", message: "Fix proposal not found" });
      return;
    }

    const parseResult = ApproveFixProposalRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: "approval_identity_required",
        message: "Explicit approver identity ('approvedBy') is required to sign off on a fix",
      });
      return;
    }

    proposal.status = "approved";
    proposal.approvedBy = parseResult.data.approvedBy;
    fixProposalStore.set(proposal.id, proposal);

    logger.info({ proposalId: proposal.id, approvedBy: proposal.approvedBy }, "Fix proposal approved");
    res.json(proposal);
  });

  // POST /api/v1/fix-proposals/:id/reject
  router.post("/:id/reject", (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: "missing_id" });
      return;
    }
    const proposal = fixProposalStore.get(id);
    if (!proposal) {
      res.status(404).json({ error: "not_found", message: "Fix proposal not found" });
      return;
    }

    proposal.status = "rejected";
    fixProposalStore.set(proposal.id, proposal);

    logger.info({ proposalId: proposal.id }, "Fix proposal rejected");
    res.json(proposal);
  });

  // POST /api/v1/fix-proposals/:id/apply (Only allowed when approved)
  router.post("/:id/apply", (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: "missing_id" });
      return;
    }
    const proposal = fixProposalStore.get(id);
    if (!proposal) {
      res.status(404).json({ error: "not_found", message: "Fix proposal not found" });
      return;
    }

    if (proposal.status !== "approved") {
      res.status(403).json({
        error: "approval_required",
        message: "Cannot apply fix proposal without explicit human approval",
        currentStatus: proposal.status,
      });
      return;
    }

    proposal.status = "applied";
    fixProposalStore.set(proposal.id, proposal);

    logger.info({ proposalId: proposal.id, file: proposal.file }, "Applied approved fix proposal");
    res.json(proposal);
  });

  return router;
}
