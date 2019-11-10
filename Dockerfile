FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=31313

EXPOSE 31313

CMD [ "npm", "start" ]
