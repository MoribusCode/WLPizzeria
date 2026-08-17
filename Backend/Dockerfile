FROM node:18

WORKDIR /app/Backend

COPY package.json package-lock.json tsconfig.json ./
COPY tsFiles ./tsFiles

RUN npm install
RUN npx tsc

EXPOSE 3000

CMD ["node", "./dist/Server/server.js"]
