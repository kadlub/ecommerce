# Etap budowania aplikacji React
FROM node:18 AS build
WORKDIR /app
COPY . . 
RUN npm install && npm run build

# Etap serwowania plików za pomocą Nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.template

# Zamiana zmiennej placeholder w nginx.conf na wartość z API_GATEWAY_URL
ENV API_GATEWAY_URL http://api-gateway.musify.svc.cluster.local:8080
RUN envsubst '${API_GATEWAY_URL}' < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]