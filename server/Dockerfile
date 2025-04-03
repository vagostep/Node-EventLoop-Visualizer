FROM node:22-alpine

WORKDIR /app 

COPY package*.json /app
RUN npm install

COPY src .

COPY node/node.exe .

ENV NODE_PATH="./node"

EXPOSE 8090 

CMD ["node", "main/app.js"]