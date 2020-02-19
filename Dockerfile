FROM node:alpine as builder

WORKDIR /client

COPY ./client ./

RUN npm install && npm run build

FROM node:alpine

COPY --from=builder /client/build/ /dist/

COPY package*.json ./

COPY server.js ./

RUN npm install

CMD ["npm", "run", "start"]