FROM node:0.10.38

RUN mkdir /app
WORKDIR /app

RUN npm install -g nodemon

COPY package.json /app/

RUN npm install

COPY . /app

EXPOSE 4000

CMD ["npm", "start"]