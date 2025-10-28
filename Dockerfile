# Use a imagem base Node.js
FROM node:20-alpine

WORKDIR /usr/src/app

RUN apk update && apk add --no-cache openssl

COPY package*.json .

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build
