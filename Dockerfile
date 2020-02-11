FROM node:alpine

WORKDIR "/dock-hand"

COPY ./client ./client

RUN cd client && npm install && npm run build

COPY package.json .

RUN npm install

COPY . .


CMD ["npm", "run", "start"]