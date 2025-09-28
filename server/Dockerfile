FROM ubuntu:24.04

# Evita errores interactivos
ENV DEBIAN_FRONTEND=noninteractive

# Instala dependencias del sistema y Node.js oficial
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    gnupg \
    build-essential \
    libssl-dev \
    libstdc++6 \
    libgcc-s1 \
    && rm -rf /var/lib/apt/lists/*

# Instala Node.js oficial (desde NodeSource)
RUN curl -fsSL https://deb.nodesource.com/setup_24.x | bash - \
    && apt-get install -y nodejs

# Verifica Node.js instalado por apt
RUN node -v && which node

WORKDIR /app 

COPY package*.json /app

RUN npm install

COPY src .

RUN chmod +x /app/worker/worker.js

COPY node/node /app/node/

ENV NODE_PATH="node/node"

EXPOSE 8090 

CMD ["node", "main/app.js"]