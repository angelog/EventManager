# syntax=docker/dockerfile:1

# ---------- Base ----------
FROM node:24-alpine AS base
WORKDIR /app

# ---------- Builder ----------
# Instala TODAS as dependências, gera o Prisma Client e compila o TypeScript.
FROM base AS builder
ENV NODE_ENV=development
# Instala só as dependências primeiro para aproveitar o cache de layers.
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
# Código-fonte + schema; gera o client e compila para dist/.
COPY . .
RUN npx prisma generate && npm run build

# ---------- Runner ----------
# Imagem final enxuta: apenas dependências de produção + artefatos compilados.
FROM base AS runner
ENV NODE_ENV=production

# Somente dependências de produção (sem prisma CLI, tsc, etc.).
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Artefatos compilados: inclui o Prisma Client gerado e a doc OpenAPI (dist/docs).
COPY --from=builder /app/dist ./dist

# Executa como usuário sem privilégios (já existe na imagem oficial do Node).
USER node

EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3333/health || exit 1

CMD ["node", "dist/server.js"]
