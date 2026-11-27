FROM node:22-alpine AS base

# Install Bun for package management and fast production runtime (bun:sqlite)
COPY --from=oven/bun:1.2.19-alpine /usr/local/bin/bun /usr/local/bin/bun

WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source and build Next.js
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx next build

# Ensure SQLite data directory exists
RUN mkdir -p /app/data

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["bun", "--bun", "next", "start", "-H", "0.0.0.0", "-p", "3000"]
