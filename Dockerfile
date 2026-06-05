# Stage 1: Build
FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Stage 2: Run
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

USER node

CMD ["node", "dist/main"]
