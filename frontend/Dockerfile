# Step 1: Build the app
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .  

RUN yarn build

# Step 2: Serve with Nginx
FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
