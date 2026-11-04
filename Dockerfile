FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm@9.0.0

FROM base AS dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY apps/worker/package.json ./apps/worker/
COPY packages/agents/package.json ./packages/agents/
COPY packages/database/package.json ./packages/database/
COPY packages/github/package.json ./packages/github/
COPY packages/observability/package.json ./packages/observability/
COPY packages/repository-context/package.json ./packages/repository-context/
COPY packages/review-contracts/package.json ./packages/review-contracts/
COPY packages/static-analysis/package.json ./packages/static-analysis/
RUN pnpm install --frozen-lockfile

FROM dependencies AS build
COPY . .
RUN pnpm --filter @acr/database db:generate
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g pnpm@9.0.0
COPY --from=build /app ./

EXPOSE 3000
CMD ["pnpm", "--filter", "@acr/api", "start"]

