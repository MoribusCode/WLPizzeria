FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build

FROM nginx:1.27-alpine

RUN apk add --no-cache gettext

COPY --from=build /app/dist/weeklylist /usr/share/nginx/html
COPY my-angular-app.conf /etc/nginx/conf.d/my-angular-app.conf.template
COPY start-nginx.sh /start-nginx.sh
RUN chmod +x /start-nginx.sh

EXPOSE 80

ENTRYPOINT ["/start-nginx.sh"]
