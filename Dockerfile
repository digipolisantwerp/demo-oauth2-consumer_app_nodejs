FROM node:18

RUN mkdir /app
WORKDIR /app

COPY package*.json  /app/

RUN npm ci

COPY . /app

CMD ["npm", "start"]
