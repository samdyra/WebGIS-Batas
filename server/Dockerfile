# adapted from https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:20-slim
WORKDIR /app/server
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD [ "npm", "run", "start" ]
