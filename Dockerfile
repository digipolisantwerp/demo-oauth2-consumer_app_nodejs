FROM node:22

RUN mkdir /app
WORKDIR /app

COPY package*.json /app/

RUN npm ci

COPY . /app

CMD ["node", "index.js"]
