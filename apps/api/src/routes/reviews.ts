import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { prisma } from "@acr/database";
import { logger } from "@acr/observability";

export const FeedbackInputSchema = z.object({
  userId: z.string().min(1),
  feedbackType: z.enum(["useful", "incorrect", "dismissed"]),
  comment: z.string().optional(),
});

export function createReviewRouter(): Router {
  const router = Router();

  function getTenantInstallationId(req: Request): string | undefined {
    const val = req.headers["x-installation-id"] ?? req.headers["x-tenant-id"];
    return Array.isArray(val) ? val[0] : val;
  }

  // GET /api/v1/reviews/:id - Get review job details with findings and agent runs
  router.get("/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const installationId = getTenantInstallationId(req);

      if (!id) {
        res.status(400).json({ error: "Missing review id" });
        return;
      }

      const review = await prisma.reviewJob.findUnique({
        where: { id },
        include: {
          repository: {
            select: { id: true, owner: true, name: true, installationId: true },
          },
          pullRequest: {
            select: { id: true, githubPrNumber: true, title: true, headSha: true, state: true },
          },
          agentRuns: {
            select: {
              id: true,
              agentType: true,
              status: true,
              durationMs: true,
              inputTokens: true,
              outputTokens: true,
            },
          },
          findings: {
            include: {
              feedbacks: true,
            },
          },
        },
      });

      if (!review) {
        res.status(404).json({ error: "Review not found" });
        return;
      }

      // Authorization guard
      if (installationId && review.repository.installationId !== installationId) {
        res.status(403).json({ error: "Forbidden: You do not have access to this review" });
        return;
      }

      res.json({ review });
    } catch (error) {
      logger.error({ error }, "Failed to get review");
      res.status(500).json({ error: "Failed to get review" });
    }
  });

  // POST /api/v1/findings/:id/feedback - Submit feedback on a finding
  router.post("/findings/:id/feedback", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: "Missing finding id" });
        return;
      }

      const parsed = FeedbackInputSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Invalid feedback payload", details: parsed.error.format() });
        return;
      }

      const finding = await prisma.finding.findUnique({ where: { id } });
      if (!finding) {
        res.status(404).json({ error: "Finding not found" });
        return;
      }

      // Ensure user exists or create placeholder
      const user = await prisma.user.upsert({
        where: { id: parsed.data.userId },
        create: {
          id: parsed.data.userId,
          email: `${parsed.data.userId}@example.com`,
          displayName: parsed.data.userId,
        },
        update: {},
      });

      const feedback = await prisma.findingFeedback.create({
        data: {
          findingId: id,
          userId: user.id,
          feedbackType: parsed.data.feedbackType,
          comment: parsed.data.comment,
        },
      });

      logger.info({ findingId: id, feedbackType: parsed.data.feedbackType }, "Finding feedback recorded");
      res.status(201).json({ feedback });
    } catch (error) {
      logger.error({ error }, "Failed to record finding feedback");
      res.status(500).json({ error: "Failed to record finding feedback" });
    }
  });

  return router;
}

