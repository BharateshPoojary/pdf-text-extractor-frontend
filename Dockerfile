# ─── Stage 1: Base ───────────────────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS pnpm-base
RUN npm i -g pnpm@10.28.2

# ─── Stage 2: All Dependencies (for building) ────────────────────────────────
FROM pnpm-base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# ─── Stage 3: Prod Dependencies Only (for running) ───────────────────────────
FROM pnpm-base AS prod-deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod

# ─── Stage 4: Builder ────────────────────────────────────────────────────────
FROM pnpm-base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_BACKEND_BASE_URL=$NEXT_PUBLIC_API_URL
RUN pnpm run build

# ─── Stage 5: Production Runner ──────────────────────────────────────────────
FROM base AS runner

# ✅ Fix 1 — added --ingroup nodejs
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 --ingroup nodejs nextjs

# ✅ Change ownership and mode
RUN chown nextjs:nodejs /app \
 && chmod 750 /app

COPY --chown=nextjs:nodejs --from=prod-deps /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs --from=builder   /app/.next         ./.next

COPY --chown=nextjs:nodejs --from=builder /app/public ./public

USER nextjs



CMD ["node_modules/.bin/next", "start"]