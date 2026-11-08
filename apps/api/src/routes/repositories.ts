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

export const CreateRepositorySchema = z.object({
  owner: z.string().min(1, "Owner is required").trim(),
  name: z.string().min(1, "Repository name is required").trim(),
  defaultBranch: z.string().min(1).default("main").optional(),
  githubRepositoryId: z.number().int().positive().optional(),
  installationId: z.string().optional(),
  reviewConfig: z.record(z.any()).optional(),
  isEnabled: z.boolean().default(true).optional(),
});

export type CreateRepositoryInput = z.infer<typeof CreateRepositorySchema>;

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

  // POST /api/v1/repositories - Add / Register a new repository
  router.post("/", async (req: Request, res: Response) => {
    try {
      const tenantInstallationId = getTenantInstallationId(req);
      const parseResult = CreateRepositorySchema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({
          error: "Invalid repository payload",
          details: parseResult.error.format(),
        });
        return;
      }

      const { owner, name, defaultBranch, githubRepositoryId, installationId, reviewConfig, isEnabled } = parseResult.data;

      // 1. Resolve or auto-provision GitHub installation
      let finalInstallationId = installationId ?? tenantInstallationId;

      if (!finalInstallationId) {
        const existingInst =
          (await prisma.githubInstallation.findFirst({
            where: { accountLogin: owner },
          })) ?? (await prisma.githubInstallation.findFirst());

        if (existingInst) {
          finalInstallationId = existingInst.id;
        } else {
          const newInst = await prisma.githubInstallation.create({
            data: {
              id: `inst-${owner.toLowerCase().replace(/[^a-z0-9]/g, "")}-${Date.now().toString().slice(-4)}`,
              githubInstallationId: Math.floor(1000000 + Math.random() * 9000000),
              accountLogin: owner,
              accountType: "User",
            },
          });
          finalInstallationId = newInst.id;
        }
      }

      // 2. Check if repository already exists
      const existingRepo = await prisma.repository.findFirst({
        where: {
          owner,
          name,
          installationId: finalInstallationId,
        },
      });

      if (existingRepo) {
        res.status(409).json({
          error: "Repository already registered",
          repository: existingRepo,
        });
        return;
      }

      // 3. Create repository record
      const repo = await prisma.repository.create({
        data: {
          owner,
          name,
          defaultBranch: defaultBranch ?? "main",
          githubRepositoryId: githubRepositoryId ?? Math.floor(10000000 + Math.random() * 90000000),
          installationId: finalInstallationId,
          isEnabled: isEnabled ?? true,
          reviewConfig: reviewConfig ?? {
            confidenceThreshold: 0.75,
            automatedPublishing: true,
            agents: {
              correctness: true,
              security: true,
              quality: true,
              performance: true,
              dependency: true,
            },
            conventions: [
              "Always return early to minimize indentation",
              "Never commit API keys or development credentials",
            ],
          },
        },
      });

      logger.info({ id: repo.id, owner, name }, "Repository successfully created");
      res.status(201).json({ repository: repo });
    } catch (error) {
      logger.error({ error }, "Failed to create repository");
      res.status(500).json({ error: "Failed to create repository" });
    }
  });

  // DELETE /api/v1/repositories/:id - Remove a repository
  router.delete("/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const installationId = getTenantInstallationId(req);

      if (!id) {
        res.status(400).json({ error: "Missing repository id" });
        return;
      }

      const repo = await prisma.repository.findUnique({ where: { id } });
      if (!repo) {
        res.status(404).json({ error: "Repository not found" });
        return;
      }

      if (installationId && repo.installationId !== installationId) {
        res.status(403).json({ error: "Forbidden: You do not have permission to delete this repository" });
        return;
      }

      await prisma.repository.delete({ where: { id } });
      logger.info({ id }, "Repository successfully deleted");
      res.json({ message: "Repository successfully deleted", id });
    } catch (error) {
      logger.error({ error }, "Failed to delete repository");
      res.status(500).json({ error: "Failed to delete repository" });
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

  // PATCH /api/v1/repositories/:id/settings and /api/v1/repositories/:id
  router.patch(["/:id/settings", "/:id"], async (req: Request, res: Response) => {
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

