import { prisma } from "@acr/database";
import { logger } from "@acr/observability";

export interface CleanupOptions {
  olderThanDays: number;
  dryRun?: boolean;
}

export interface CleanupResult {
  deletedDeliveries: number;
  deletedJobs: number;
  cutoffDate: Date;
  dryRun: boolean;
}

export interface TenantExport {
  installationId: string;
  exportedAt: string;
  repositories: Array<{
    id: string;
    owner: string;
    name: string;
    pullRequests: Array<{
      githubPrNumber: number;
      title: string;
      reviewJobs: Array<{
        id: string;
        headSha: string;
        status: string;
        startedAt: Date | null;
        completedAt: Date | null;
        findings: Array<{
          id: string;
          category: string;
          severity: string;
          filePath: string;
          line: number;
          description: string;
          verificationStatus: string;
        }>;
      }>;
    }>;
  }>;
}

/**
 * Data retention service to enforce compliance, GDPR hygiene, and storage limits.
 */
export async function cleanupOldData(options: CleanupOptions): Promise<CleanupResult> {
  const { olderThanDays, dryRun = false } = options;
  const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);

  logger.info({ cutoffDate, dryRun }, "Starting data retention cleanup");

  if (dryRun) {
    const deliveryCount = await prisma.webhookDelivery.count({
      where: { receivedAt: { lt: cutoffDate } },
    });
    const jobCount = await prisma.reviewJob.count({
      where: {
        completedAt: { lt: cutoffDate },
        status: { in: ["completed", "failed"] },
      },
    });

    return {
      deletedDeliveries: deliveryCount,
      deletedJobs: jobCount,
      cutoffDate,
      dryRun: true,
    };
  }

  // 1. Delete old webhook deliveries
  const deliveriesResult = await prisma.webhookDelivery.deleteMany({
    where: { receivedAt: { lt: cutoffDate } },
  });

  // 2. Delete old completed/failed review jobs (Prisma or manual cascade)
  // Findings and AgentRuns referencing these jobs
  const oldJobs = await prisma.reviewJob.findMany({
    where: {
      completedAt: { lt: cutoffDate },
      status: { in: ["completed", "failed"] },
    },
    select: { id: true },
  });

  const jobIds = oldJobs.map((j: { id: string }) => j.id);

  if (jobIds.length > 0) {
    // Clean child findings and agent runs
    await prisma.findingFeedback.deleteMany({
      where: { finding: { reviewJobId: { in: jobIds } } },
    });
    await prisma.finding.deleteMany({
      where: { reviewJobId: { in: jobIds } },
    });
    await prisma.agentRun.deleteMany({
      where: { reviewJobId: { in: jobIds } },
    });
    await prisma.reviewJob.deleteMany({
      where: { id: { in: jobIds } },
    });
  }

  logger.info(
    { deletedDeliveries: deliveriesResult.count, deletedJobs: jobIds.length },
    "Data retention cleanup completed"
  );

  return {
    deletedDeliveries: deliveriesResult.count,
    deletedJobs: jobIds.length,
    cutoffDate,
    dryRun: false,
  };
}

/**
 * Exports all review history, findings, and metadata for a tenant installation.
 */
export async function exportTenantData(installationId: string): Promise<TenantExport> {
  logger.info({ installationId }, "Exporting tenant review data");

  const repos: any[] = await prisma.repository.findMany({
    where: { installationId },
    include: {
      pullRequests: {
        include: {
          reviewJobs: {
            include: {
              findings: {
                select: {
                  id: true,
                  category: true,
                  severity: true,
                  filePath: true,
                  line: true,
                  description: true,
                  verificationStatus: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return {
    installationId,
    exportedAt: new Date().toISOString(),
    repositories: repos.map((repo: any) => ({
      id: repo.id,
      owner: repo.owner,
      name: repo.name,
      pullRequests: (repo.pullRequests ?? []).map((pr: any) => ({
        githubPrNumber: pr.githubPrNumber,
        title: pr.title,
        reviewJobs: (pr.reviewJobs ?? []).map((job: any) => ({
          id: job.id,
          headSha: job.headSha,
          status: job.status,
          startedAt: job.startedAt,
          completedAt: job.completedAt,
          findings: job.findings ?? [],
        })),
      })),
    })),
  };
}
