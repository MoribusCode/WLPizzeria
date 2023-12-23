FROM node:14

#RUN npm install -g typescript

RUN mkdir -p /app/Backend
WORKDIR /app/Backend
COPY package.json package-lock.json /app/Backend/
RUN npm install

COPY /dist/ /app/Backend/dist
COPY /tsconfig.json /app/Backend/

EXPOSE 3000

#ENTRYPOINT ["tail", "-f", "/dev/null"]
#CMD ["npm", "run", "test"]
CMD ["node", "./dist/Server/server.js"]