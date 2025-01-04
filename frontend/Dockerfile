FROM node:20-alpine AS build

ARG VITE_API_BASE_URL
ARG VITE_PORT

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_PORT=$VITE_PORT

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "dev", "--host", "0.0.0.0"]
