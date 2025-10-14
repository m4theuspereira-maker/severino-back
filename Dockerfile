# Use a imagem base Node.js
FROM node:latest

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build
