FROM node:22-alpine
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.8.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm exec prisma generate
RUN pnpm run build

EXPOSE 3000

CMD ["sh", "-c", "pnpm exec prisma migrate deploy && node dist/index.js"]