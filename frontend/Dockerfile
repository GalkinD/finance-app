# ── Stage 1: сборка React-приложения ────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

# Отключаем CI-режим чтобы предупреждения не роняли сборку
ENV CI=false

RUN npm run build

# ── Stage 2: раздача статики через Nginx ─────────────────────
FROM nginx:1.25-alpine

# Копируем собранные файлы React
COPY --from=builder /app/build /usr/share/nginx/html

# Копируем нашу конфигурацию Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
