FROM node:20

RUN mkdir /app
WORKDIR /app

COPY .npmrc package*.json /app/

RUN npm ci

COPY . /app

CMD ["npm", "run", "startapp"]
