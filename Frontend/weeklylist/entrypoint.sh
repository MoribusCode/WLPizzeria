#!/bin/sh

# Heroku provides the PORT environment variable at runtime
sed -i "s/Listen 80/Listen ${PORT}/g" /usr/local/apache2/conf/httpd.conf

# Start Apache in the foreground
httpd-foreground
