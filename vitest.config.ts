import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      "@acr/review-contracts": path.resolve(__dirname, "packages/review-contracts/src/index.ts"),
      "@acr/observability": path.resolve(__dirname, "packages/observability/src/index.ts"),
      "@acr/database": path.resolve(__dirname, "packages/database/src/index.ts"),
      "@acr/github": path.resolve(__dirname, "packages/github/src/index.ts"),
      "@acr/repository-context": path.resolve(__dirname, "packages/repository-context/src/index.ts"),
      "@acr/static-analysis": path.resolve(__dirname, "packages/static-analysis/src/index.ts"),
      "@acr/agents": path.resolve(__dirname, "packages/agents/src/index.ts"),
    },
  },
});

