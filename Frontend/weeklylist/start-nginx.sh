#!/bin/sh

echo "Starting script..."

echo "Permessi"
ls -l /etc/nginx/conf.d/

# Verifica se il file template esiste e stampa il suo contenuto
if [ -f "/etc/nginx/conf.d/my-angular-app.conf.template" ]; then
    echo "my-angular-app.conf.template exists. Its content is:"
    cat /etc/nginx/conf.d/my-angular-app.conf.template
else
    echo "my-angular-app.conf.template does not exist."
fi

echo "Applying envsubst..."
envsubst < /etc/nginx/conf.d/my-angular-app.conf.template > /etc/nginx/conf.d/default.conf

# Verifica se envsubst ha funzionato stampando il contenuto di default.conf
if [ $? -eq 0 ]; then
    echo "envsubst applied successfully. default.conf content is:"
    cat /etc/nginx/conf.d/default.conf
else
    echo "Failed to apply envsubst."
fi

echo "Starting Nginx..."
exec nginx -g 'daemon off;'
