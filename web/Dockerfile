# syntax=docker/dockerfile:1

# ---------- Base ----------
FROM node:24-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---------- Deps ----------
# Instala dependências isoladamente para aproveitar o cache de layers.
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---------- Builder ----------
FROM base AS builder
# URL da API usada apenas no lado servidor (BFF/route handlers do Next). O browser
# fala com o próprio Next via rotas relativas, então este valor aponta para a rede
# interna do compose (serviço "api").
ARG NEXT_PUBLIC_API_URL=http://api:3333
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- Runner ----------
# Imagem final servindo o output standalone (Node mínimo, sem deps de dev).
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# O output standalone já traz o node_modules mínimo e o server.js.
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
