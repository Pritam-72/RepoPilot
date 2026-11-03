import { logger } from "@acr/observability";

export interface ConcurrencyLimiterOptions {
  defaultLimit?: number;
  tenantOverrides?: Record<string, number>;
}

/**
 * In-memory / token-based concurrency limiter for multi-tenant job isolation.
 * Prevents a single tenant from exhausting worker capacity.
 */
export class TenantConcurrencyLimiter {
  private activeJobs: Map<string, number> = new Map();
  private defaultLimit: number;
  private tenantOverrides: Map<string, number>;

  constructor(options: ConcurrencyLimiterOptions = {}) {
    this.defaultLimit = options.defaultLimit ?? 5;
    this.tenantOverrides = new Map(Object.entries(options.tenantOverrides ?? {}));
  }

  public getLimitForTenant(tenantId: string): number {
    return this.tenantOverrides.get(tenantId) ?? this.defaultLimit;
  }

  public getActiveCount(tenantId: string): number {
    return this.activeJobs.get(tenantId) ?? 0;
  }

  /**
   * Attempts to acquire a concurrency slot for the given tenant.
   * Returns true if acquired, false if tenant has reached concurrency limit.
   */
  public tryAcquire(tenantId: string): boolean {
    const current = this.getActiveCount(tenantId);
    const limit = this.getLimitForTenant(tenantId);

    if (current >= limit) {
      logger.warn(
        { tenantId, current, limit },
        "Tenant reached maximum concurrent review jobs limit"
      );
      return false;
    }

    this.activeJobs.set(tenantId, current + 1);
    return true;
  }

  /**
   * Releases an acquired concurrency slot for the tenant.
   */
  public release(tenantId: string): void {
    const current = this.getActiveCount(tenantId);
    if (current <= 1) {
      this.activeJobs.delete(tenantId);
    } else {
      this.activeJobs.set(tenantId, current - 1);
    }
  }

  /**
   * Resets all tracking state.
   */
  public clear(): void {
    this.activeJobs.clear();
  }
}

export const defaultConcurrencyLimiter = new TenantConcurrencyLimiter();
