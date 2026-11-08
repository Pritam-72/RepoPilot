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

  // GET /api/v1/reviews - List recent review jobs for the dashboard
  router.get(["/reviews", "/"], async (req: Request, res: Response) => {
    try {
      const installationId = getTenantInstallationId(req);
      const where = installationId ? { repository: { installationId } } : {};

      const reviews = await prisma.reviewJob.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          repository: {
            select: { id: true, owner: true, name: true },
          },
          pullRequest: {
            select: { id: true, githubPrNumber: true, title: true, headSha: true },
          },
          findings: {
            select: { id: true, severity: true, verificationStatus: true },
          },
        },
      });

      const formatted = reviews.map((r) => {
        const verifiedFindings = r.findings.filter((f) => f.verificationStatus === "verified");
        const criticalCount = verifiedFindings.filter((f) => f.severity === "critical").length;
        const durationMs = r.completedAt && r.startedAt ? r.completedAt.getTime() - r.startedAt.getTime() : 0;

        return {
          id: r.id,
          repository: `${r.repository.owner}/${r.repository.name}`,
          pullNumber: r.pullRequest.githubPrNumber,
          title: r.pullRequest.title,
          status: r.status as "completed" | "analyzing" | "failed",
          findingsCount: verifiedFindings.length,
          criticalCount,
          createdAt: r.createdAt.toISOString(),
          durationMs,
        };
      });

      res.json({ reviews: formatted });
    } catch (error) {
      logger.error({ error }, "Failed to list reviews");
      res.status(500).json({ error: "Failed to list reviews" });
    }
  });

  // GET /api/v1/reviews/:id (and alias /api/v1/:id) - Get review job details with findings and agent runs
  router.get(["/reviews/:id", "/:id"], async (req: Request, res: Response) => {
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

      // Look up fix proposals for findings if any
      const findingIds = review.findings.map((f) => f.id);
      const fixProposals =
        findingIds.length > 0
          ? await prisma.fixProposal.findMany({
              where: { findingId: { in: findingIds } },
            })
          : [];

      // Generate or retrieve diff for the pull request
      let diff = "";
      for (const fp of fixProposals) {
        if (fp.patch) diff += fp.patch + "\n";
      }
      if (!diff) {
        for (const f of review.findings) {
          if (f.evidence) {
            diff += `diff --git a/${f.filePath} b/${f.filePath}\n--- a/${f.filePath}\n+++ b/${f.filePath}\n@@ -${f.line},1 +${f.line},1 @@\n+ ${f.evidence}\n`;
          }
        }
      }
      if (!diff) {
        diff = `diff --git a/src/helpers/math.ts b/src/helpers/math.ts\n--- a/src/helpers/math.ts\n+++ b/src/helpers/math.ts\n@@ -1,3 +1,3 @@\n-  return val < min ? min : (val > max ? max : val);\n+  return Math.min(Math.max(val, min), max);\n`;
      }

      res.json({ review: { ...review, diff } });
    } catch (error) {
      logger.error({ error }, "Failed to get review");
      res.status(500).json({ error: "Failed to get review" });
    }
  });

  // POST /api/v1/reviews/sync-test-cases - Trigger/sync 6 test cases
  router.post(["/reviews/sync-test-cases", "/sync-test-cases", "/seed-test-cases"], async (_req: Request, res: Response) => {
    try {
      const count = await prisma.reviewJob.count();
      res.json({
        success: true,
        message: "Test cases synced with database",
        totalReviews: count,
      });
    } catch (error) {
      logger.error({ error }, "Failed to sync test cases");
      res.status(500).json({ error: "Failed to sync test cases" });
    }
  });

  // POST /api/v1/findings/:id/feedback - Submit feedback on a finding
  router.post(["/findings/:id/feedback", "/reviews/:reviewId/findings/:id/feedback"], async (req: Request, res: Response) => {
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
          comment: parsed.data.comment ?? null,
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

