# Etap budowania aplikacji React
FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Etap serwowania plików za pomocą Nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
