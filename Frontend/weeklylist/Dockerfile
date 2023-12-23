# Stage 1: Build the Angular app
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build

# Stage 2: Serve the app with Apache
FROM httpd:2.4

# Copy built Angular files to Apache's htdocs folder and .htaccess
COPY --from=build /app/dist/weeklylist /usr/local/apache2/htdocs/
COPY --from=build /app/.htaccess /usr/local/apache2/htdocs/

# Add custom configuration for mod_rewrite
COPY my-httpd-conf.conf /usr/local/apache2/conf/my-httpd-conf.conf
RUN echo "Include /usr/local/apache2/conf/my-httpd-conf.conf" >> /usr/local/apache2/conf/httpd.conf

# Expose port 80 for Apache (this is mainly for local testing and clarity, Heroku will ignore it)
EXPOSE 80

# Use a custom entrypoint script to adjust the port Apache listens on at runtime
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
