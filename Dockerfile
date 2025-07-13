FROM node:20-alpine AS builder

WORKDIR /app

ARG NODE_ENV=production

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

EXPOSE 4000

CMD ["node", "dist/src/main"]
