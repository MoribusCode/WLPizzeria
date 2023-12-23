#!/bin/sh

# Apply the configuration (if using envsubst or similar)
# envsubst < /usr/local/apache2/conf/my-angular-app.conf.template > /usr/local/apache2/conf/my-angular-app.conf

# Start Apache
httpd -D FOREGROUND
