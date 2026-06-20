FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile --prod

COPY dist ./dist
COPY package.json ./

USER node

CMD ["node", "dist/src/main"]
