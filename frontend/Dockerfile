# 1️⃣ Build Angular
FROM node:20-alpine AS build
WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build

# 2️⃣ Nginx
FROM nginx:alpine

# nginx.conf è in /nginx
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Angular 17+ → dist/<app>/browser
COPY --from=build /app/dist/*/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
