# Base image
FROM node:18-alpine AS base
# Add package manager
RUN npm i -g pnpm

# Dependencies
FROM base AS deps
WORKDIR /app
# Copy package files
COPY package.json pnpm-lock.yaml* ./
# Install dependencies
RUN pnpm install

# Builder
FROM base AS builder
WORKDIR /app
# Copy deps
COPY --from=deps /app/node_modules ./node_modules
# Copy project files
COPY . .
# Set env variables
ENV NEXT_TELEMETRY_DISABLED 1
# Build
RUN pnpm build

# Runner
FROM base AS runner
WORKDIR /app
# Set env variables
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Add non root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non root user
USER nextjs

# Expose port
EXPOSE 3000

# Set app port
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the app
CMD ["node", "server.js"]