FROM node:22.16.0

WORKDIR /cache
COPY package*.json ./
RUN npm ci

WORKDIR /app

COPY . .
