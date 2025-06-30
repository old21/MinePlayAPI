# Base image
FROM node:20.17-bookworm-slim

# Set environment variables for npm
ENV NPM_CONFIG_LOGLEVEL=warn \
    NPM_REGISTRY=http://192.168.20.5:4873/

# Install required packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Создаём рабочую директорию
WORKDIR /app

# Копируем файлы package.json и package-lock.json
#COPY package.json package-lock.json ./
COPY package.json ./

# Set npm registry and install dependencies
RUN npm config set registry $NPM_REGISTRY && \
    npm install --verbose && \
    npm cache clean --force

# Copy the rest of the application code
COPY . .

# Создаём dev сборку
RUN npm run build

# Указываем, что приложение будет слушать на порту 8000
EXPOSE 8000

# Запускаем приложение
CMD ["node", "dist/main.js"]