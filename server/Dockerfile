FROM node:22

WORKDIR /app 

COPY package*.json /app
RUN npm install

COPY src .

RUN chmod +x /app/worker/worker.js

COPY node/node /app/node/

ENV NODE_PATH="node/node"

EXPOSE 8090 

CMD ["node", "main/app.js"]