# ── Backend Dockerfile ───────────────────────────────────────
FROM node:20-alpine

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем только package.json сначала (кэш слоёв Docker)
COPY package.json ./

# Устанавливаем только production-зависимости
RUN npm install --omit=dev

# Копируем весь остальной код
COPY . .

# Открываем порт приложения
EXPOSE 5000

# Запуск сервера
CMD ["node", "server.js"]
