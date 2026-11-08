import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../server.js";
import { prisma } from "@acr/database";

vi.mock("@acr/database", () => {
  return {
    prisma: {
      repository: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      githubInstallation: {
        findFirst: vi.fn(),
        create: vi.fn(),
      },
      reviewJob: {
        findUnique: vi.fn(),
      },
      finding: {
        findUnique: vi.fn(),
      },
      user: {
        upsert: vi.fn(),
      },
      findingFeedback: {
        create: vi.fn(),
      },
    },
  };
});

describe("Repository Settings & Tenant Authorization API (Task 7.2)", () => {
  const app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists repositories scoped to tenant when x-installation-id header provided", async () => {
    vi.mocked(prisma.repository.findMany).mockResolvedValue([
      {
        id: "repo-1",
        owner: "acme",
        name: "frontend",
        defaultBranch: "main",
        isEnabled: true,
        reviewConfig: { minimumConfidence: 0.8 },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as any);

    const res = await request(app)
      .get("/api/v1/repositories")
      .set("x-installation-id", "inst-100");

    expect(res.status).toBe(200);
    expect(res.body.repositories).toHaveLength(1);
    expect(prisma.repository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { installationId: "inst-100" },
      })
    );
  });

  it("allows access to repository when tenant installationId matches", async () => {
    vi.mocked(prisma.repository.findUnique).mockResolvedValue({
      id: "repo-1",
      installationId: "inst-100",
      owner: "acme",
      name: "frontend",
    } as any);

    const res = await request(app)
      .get("/api/v1/repositories/repo-1")
      .set("x-installation-id", "inst-100");

    expect(res.status).toBe(200);
    expect(res.body.repository.id).toBe("repo-1");
  });

  it("denies access with 403 Forbidden when accessing cross-tenant repository", async () => {
    vi.mocked(prisma.repository.findUnique).mockResolvedValue({
      id: "repo-2",
      installationId: "inst-different",
      owner: "evil-corp",
      name: "backend",
    } as any);

    const res = await request(app)
      .get("/api/v1/repositories/repo-2")
      .set("x-installation-id", "inst-100");

    expect(res.status).toBe(403);
    expect(res.body.error).toContain("Forbidden");
  });

  it("updates repository settings with valid payload and authorization", async () => {
    vi.mocked(prisma.repository.findUnique).mockResolvedValue({
      id: "repo-1",
      installationId: "inst-100",
      owner: "acme",
      name: "frontend",
      isEnabled: true,
      reviewConfig: {},
    } as any);

    vi.mocked(prisma.repository.update).mockResolvedValue({
      id: "repo-1",
      owner: "acme",
      name: "frontend",
      isEnabled: true,
      reviewConfig: { minimumConfidence: 0.85, enabledCategories: ["correctness", "security"] },
      updatedAt: new Date(),
    } as any);

    const res = await request(app)
      .patch("/api/v1/repositories/repo-1/settings")
      .set("x-installation-id", "inst-100")
      .send({
        minimumConfidence: 0.85,
        enabledCategories: ["correctness", "security"],
        automatedPublishing: true,
      });

    expect(res.status).toBe(200);
    expect(res.body.repository.reviewConfig.minimumConfidence).toBe(0.85);
  });

  it("rejects cross-tenant repository settings modification with 403", async () => {
    vi.mocked(prisma.repository.findUnique).mockResolvedValue({
      id: "repo-1",
      installationId: "inst-other",
      owner: "acme",
      name: "frontend",
      isEnabled: true,
      reviewConfig: {},
    } as any);

    const res = await request(app)
      .patch("/api/v1/repositories/repo-1/settings")
      .set("x-installation-id", "inst-100")
      .send({
        minimumConfidence: 0.9,
      });

    expect(res.status).toBe(403);
    expect(prisma.repository.update).not.toHaveBeenCalled();
  });

  it("validates repository settings schema and returns 400 on invalid values", async () => {
    const res = await request(app)
      .patch("/api/v1/repositories/repo-1/settings")
      .set("x-installation-id", "inst-100")
      .send({
        minimumConfidence: 5.0, // Invalid: must be <= 1
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Invalid repository settings");
  });

  it("records finding feedback successfully", async () => {
    vi.mocked(prisma.finding.findUnique).mockResolvedValue({ id: "finding-1" } as any);
    vi.mocked(prisma.user.upsert).mockResolvedValue({ id: "user-1" } as any);
    vi.mocked(prisma.findingFeedback.create).mockResolvedValue({
      id: "fb-1",
      findingId: "finding-1",
      userId: "user-1",
      feedbackType: "useful",
    } as any);

    const res = await request(app)
      .post("/api/v1/findings/finding-1/feedback")
      .send({
        userId: "user-1",
        feedbackType: "useful",
        comment: "Found real off-by-one error",
      });

    expect(res.status).toBe(201);
    expect(res.body.feedback.feedbackType).toBe("useful");
  });

  describe("POST /api/v1/repositories (Add Repository)", () => {
    it("creates a new repository with default branch and auto-provisioned installation", async () => {
      vi.mocked(prisma.githubInstallation.findFirst).mockResolvedValue({
        id: "inst-100",
        accountLogin: "acme-corp",
      } as any);
      vi.mocked(prisma.repository.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.repository.create).mockResolvedValue({
        id: "repo-new",
        owner: "acme-corp",
        name: "billing-service",
        defaultBranch: "main",
        isEnabled: true,
        installationId: "inst-100",
        reviewConfig: { confidenceThreshold: 0.75 },
      } as any);

      const res = await request(app)
        .post("/api/v1/repositories")
        .send({
          owner: "acme-corp",
          name: "billing-service",
        });

      expect(res.status).toBe(201);
      expect(res.body.repository.id).toBe("repo-new");
      expect(res.body.repository.name).toBe("billing-service");
      expect(prisma.repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            owner: "acme-corp",
            name: "billing-service",
            defaultBranch: "main",
            installationId: "inst-100",
          }),
        })
      );
    });

    it("rejects repository creation when owner or name is missing", async () => {
      const res = await request(app)
        .post("/api/v1/repositories")
        .send({
          owner: "",
          name: "",
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("Invalid repository payload");
    });

    it("returns 409 Conflict when repository already exists", async () => {
      vi.mocked(prisma.githubInstallation.findFirst).mockResolvedValue({
        id: "inst-100",
        accountLogin: "acme-corp",
      } as any);
      vi.mocked(prisma.repository.findFirst).mockResolvedValue({
        id: "repo-existing",
        owner: "acme-corp",
        name: "billing-service",
      } as any);

      const res = await request(app)
        .post("/api/v1/repositories")
        .send({
          owner: "acme-corp",
          name: "billing-service",
        });

      expect(res.status).toBe(409);
      expect(res.body.error).toContain("already registered");
    });

    it("deletes a repository successfully", async () => {
      vi.mocked(prisma.repository.findUnique).mockResolvedValue({
        id: "repo-del",
        installationId: "inst-100",
      } as any);
      vi.mocked(prisma.repository.delete).mockResolvedValue({ id: "repo-del" } as any);

      const res = await request(app)
        .delete("/api/v1/repositories/repo-del")
        .set("x-installation-id", "inst-100");

      expect(res.status).toBe(200);
      expect(res.body.message).toContain("successfully deleted");
    });
  });
});

