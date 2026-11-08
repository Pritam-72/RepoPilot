import { logger } from "@acr/observability";
import type { TokenUsage } from "../llm-provider.js";

export interface CostGuardOptions {
  maxTokensPerReview?: number | undefined;
}

export class CostCapExceededError extends Error {
  constructor(public readonly totalTokensUsed: number, public readonly maxTokensAllowed: number) {
    super(`Cost cap exceeded: ${totalTokensUsed} tokens used >= ${maxTokensAllowed} max allowed tokens`);
    this.name = "CostCapExceededError";
  }
}

export class CostGuard {
  public readonly maxTokens: number;
  private promptTokens = 0;
  private completionTokens = 0;
  private isCapReached = false;

  constructor(options: CostGuardOptions = {}) {
    this.maxTokens =
      options.maxTokensPerReview ??
      Number(process.env["MAX_TOKENS_PER_REVIEW"] ?? 500000);
  }

  public recordUsage(usageOrPromptTokens: TokenUsage | number, completionTokens?: number): boolean {
    if (typeof usageOrPromptTokens === "number") {
      this.promptTokens += usageOrPromptTokens;
      this.completionTokens += completionTokens ?? 0;
    } else {
      this.promptTokens += usageOrPromptTokens.promptTokens;
      this.completionTokens += usageOrPromptTokens.completionTokens;
    }

    if (this.getTotalTokens() >= this.maxTokens) {
      this.isCapReached = true;
      logger.warn(
        {
          totalTokens: this.getTotalTokens(),
          maxTokens: this.maxTokens,
        },
        "MAX_TOKENS_PER_REVIEW cost cap exceeded during review"
      );
      return false;
    }
    return true;
  }

  public checkBudget(): void {
    if (this.isCapReached || this.getTotalTokens() >= this.maxTokens) {
      throw new CostCapExceededError(this.getTotalTokens(), this.maxTokens);
    }
  }

  public hasRemainingBudget(): boolean {
    return !this.isCapReached && this.getTotalTokens() < this.maxTokens;
  }

  public isCostCapReached(): boolean {
    return this.isCapReached || this.getTotalTokens() >= this.maxTokens;
  }

  public getStats(): TokenUsage {
    return this.getUsage();
  }

  public getUsage(): TokenUsage {
    return {
      promptTokens: this.promptTokens,
      completionTokens: this.completionTokens,
      totalTokens: this.promptTokens + this.completionTokens,
    };
  }

  public getTotalTokens(): number {
    return this.promptTokens + this.completionTokens;
  }
}
