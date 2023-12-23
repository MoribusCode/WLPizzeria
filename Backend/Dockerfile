FROM node:14

# Install TypeScript globalmente (se necessario)
# RUN npm install -g typescript

RUN mkdir -p /app/Backend
WORKDIR /app/Backend

COPY tsFiles /app/Backend/tsFiles
# Copia i file di configurazione e installa le dipendenze
COPY package.json package-lock.json tsconfig.json /app/Backend/
RUN npm install

# Esegui la compilazione TypeScript
RUN npx tsc

COPY dist/Server/.env ./dist/Server/

# Copia i file generati nella cartella dist
# COPY dist/ /app/Backend/dist

EXPOSE 3000

#ENTRYPOINT ["tail", "-f", "/dev/null"]
#CMD ["npm", "run", "test"]
CMD ["node", "./dist/Server/server.js"]
