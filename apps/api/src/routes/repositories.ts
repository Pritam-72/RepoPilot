import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { prisma } from "@acr/database";
import { logger } from "@acr/observability";

export const RepositorySettingsSchema = z.object({
  isEnabled: z.boolean().optional(),
  minimumConfidence: z.number().min(0).max(1).optional(),
  enabledCategories: z
    .array(z.enum(["correctness", "security", "performance", "maintainability", "testing", "dependency"]))
    .optional(),
  ignorePaths: z.array(z.string()).optional(),
  customConventions: z.array(z.string()).optional(),
  automatedPublishing: z.boolean().optional(),
});

export type RepositorySettings = z.infer<typeof RepositorySettingsSchema>;

export function createRepositoryRouter(): Router {
  const router = Router();

  /**
   * Helper to extract tenant / installation ID from request header
   */
  function getTenantInstallationId(req: Request): string | undefined {
    const val = req.headers["x-installation-id"] ?? req.headers["x-tenant-id"];
    return Array.isArray(val) ? val[0] : val;
  }

  // GET /api/v1/repositories - List repositories for the tenant
  router.get("/", async (req: Request, res: Response) => {
    try {
      const installationId = getTenantInstallationId(req);
      const where = installationId ? { installationId } : {};

      const repos = await prisma.repository.findMany({
        where,
        select: {
          id: true,
          owner: true,
          name: true,
          defaultBranch: true,
          isEnabled: true,
          reviewConfig: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: "desc" },
      });

      res.json({ repositories: repos });
    } catch (error) {
      logger.error({ error }, "Failed to list repositories");
      res.status(500).json({ error: "Failed to list repositories" });
    }
  });

  // GET /api/v1/repositories/:id - Get repository details with tenant check
  router.get("/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const installationId = getTenantInstallationId(req);

      if (!id) {
        res.status(400).json({ error: "Missing repository id" });
        return;
      }

      const repo = await prisma.repository.findUnique({
        where: { id },
        include: {
          installation: {
            select: { id: true, accountLogin: true, githubInstallationId: true },
          },
        },
      });

      if (!repo) {
        res.status(404).json({ error: "Repository not found" });
        return;
      }

      // Authorization guard: verify installationId matches if header is provided
      if (installationId && repo.installationId !== installationId) {
        logger.warn(
          { id, repoInstallationId: repo.installationId, reqInstallationId: installationId },
          "Unauthorized attempt to access repository data"
        );
        res.status(403).json({ error: "Forbidden: You do not have access to this repository" });
        return;
      }

      res.json({ repository: repo });
    } catch (error) {
      logger.error({ error }, "Failed to get repository");
      res.status(500).json({ error: "Failed to get repository" });
    }
  });

  // PATCH /api/v1/repositories/:id/settings - Update repository review settings
  router.patch("/:id/settings", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const installationId = getTenantInstallationId(req);

      if (!id) {
        res.status(400).json({ error: "Missing repository id" });
        return;
      }

      const parseResult = RepositorySettingsSchema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({
          error: "Invalid repository settings",
          details: parseResult.error.format(),
        });
        return;
      }

      const repo = await prisma.repository.findUnique({ where: { id } });
      if (!repo) {
        res.status(404).json({ error: "Repository not found" });
        return;
      }

      // Authorization guard: prevent cross-tenant mutation
      if (installationId && repo.installationId !== installationId) {
        logger.warn(
          { id, repoInstallationId: repo.installationId, reqInstallationId: installationId },
          "Unauthorized attempt to update repository settings"
        );
        res.status(403).json({ error: "Forbidden: You do not have permission to modify this repository" });
        return;
      }

      const currentConfig = (repo.reviewConfig as Record<string, unknown>) ?? {};
      const updatedConfig = {
        ...currentConfig,
        ...parseResult.data,
      };

      const updated = await prisma.repository.update({
        where: { id },
        data: {
          isEnabled: parseResult.data.isEnabled ?? repo.isEnabled,
          reviewConfig: updatedConfig,
        },
      });

      logger.info({ id, updatedConfig }, "Repository settings updated");
      res.json({
        repository: {
          id: updated.id,
          owner: updated.owner,
          name: updated.name,
          isEnabled: updated.isEnabled,
          reviewConfig: updated.reviewConfig,
          updatedAt: updated.updatedAt,
        },
      });
    } catch (error) {
      logger.error({ error }, "Failed to update repository settings");
      res.status(500).json({ error: "Failed to update repository settings" });
    }
  });

  return router;
}

