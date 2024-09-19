# Dockerfile для сервісів tiras-service1
FROM node:18-alpine

# Створення робочої директорії
WORKDIR /app

# Копіювання package.json та package-lock.json
COPY package*.json ./

# Встановлення залежностей
RUN npm install

# Копіювання всіх файлів проекту
COPY . .

# Запуск програми
CMD ["npm", "start"]
