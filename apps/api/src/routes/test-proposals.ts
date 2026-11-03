import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { prisma } from "@acr/database";
import { logger } from "@acr/observability";
import { generateRegressionTest } from "@acr/agents";
import type { Finding } from "@acr/review-contracts";

export const CreateTestProposalSchema = z.object({
  findingId: z.string().min(1),
  sourceContent: z.string().optional(),
  validateInSandbox: z.boolean().optional(),
});

// In-memory proposal store for test proposals
export const testProposalStore = new Map<string, any>();

export function createTestProposalRouter(): Router {
  const router = Router();

  // POST /api/v1/test-proposals - Generate regression test for a verified finding
  router.post("/", async (req: Request, res: Response) => {
    try {
      const parsed = CreateTestProposalSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Invalid test proposal request", details: parsed.error.format() });
        return;
      }

      const { findingId, sourceContent, validateInSandbox = false } = parsed.data;

      // 1. Fetch finding from DB
      const dbFinding = await prisma.finding.findUnique({
        where: { id: findingId },
      });

      if (!dbFinding) {
        res.status(404).json({ error: `Finding ${findingId} not found` });
        return;
      }

      const findingContract: Finding = {
        id: dbFinding.id,
        title: dbFinding.title,
        category: dbFinding.category as any,
        severity: dbFinding.severity as any,
        confidence: dbFinding.confidence,
        file: dbFinding.filePath,
        line: dbFinding.line,
        endLine: dbFinding.endLine ?? undefined,
        description: dbFinding.description,
        evidence: dbFinding.evidence,
        recommendation: dbFinding.recommendation ?? undefined,
        verificationStatus: dbFinding.verificationStatus as any,
      };

      if (findingContract.verificationStatus !== "verified") {
        res.status(400).json({
          error: `Cannot generate regression test: finding is not verified (status: ${findingContract.verificationStatus})`,
        });
        return;
      }

      const content = sourceContent || `// Source file: ${findingContract.file}\n// Content at target commit\n${findingContract.evidence}\n`;

      const proposal = await generateRegressionTest(findingContract, content, {
        validateInSandbox,
      });

      testProposalStore.set(proposal.id, proposal);

      logger.info({ proposalId: proposal.id, findingId }, "Created regression test proposal");
      res.status(201).json({ proposal });
    } catch (error) {
      logger.error({ error }, "Failed to generate regression test proposal");
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to generate test proposal" });
    }
  });

  // GET /api/v1/test-proposals/:id - Get test proposal details
  router.get("/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: "Missing test proposal id" });
        return;
      }

      const proposal = testProposalStore.get(id);
      if (!proposal) {
        res.status(404).json({ error: "Test proposal not found" });
        return;
      }

      res.json({ proposal });
    } catch (error) {
      logger.error({ error }, "Failed to get test proposal");
      res.status(500).json({ error: "Failed to get test proposal" });
    }
  });

  return router;
}

