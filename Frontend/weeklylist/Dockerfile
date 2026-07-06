# Stage 1: Build the Angular app
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:1.27-alpine

# Install envsubst for runtime template rendering
RUN apk add --no-cache gettext

# Copy built Angular files to Nginx html folder
COPY --from=build /app/dist/weeklylist /usr/share/nginx/html

# Copy Nginx SPA config template
COPY my-angular-app.conf /etc/nginx/conf.d/my-angular-app.conf.template

# Runtime entrypoint that renders the template and starts Nginx
COPY start-nginx.sh /start-nginx.sh
RUN chmod +x /start-nginx.sh

EXPOSE 80

ENTRYPOINT ["/start-nginx.sh"]
