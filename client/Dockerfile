# Stage 1: Build the app
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

# Build the application, ignoring TypeScript errors
RUN yarn build

# Stage 2: Serve the app with Nginx
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 6379

CMD ["nginx", "-g", "daemon off;"]
