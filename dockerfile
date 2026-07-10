FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

# Sem prerender, o build não renderiza páginas: NUXT_PUBLIC_SUPABASE_URL/BUCKET
# não são lidos aqui, só em runtime (via compose environment / docker run -e).
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN pnpm build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]