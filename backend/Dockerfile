FROM node:20-alpine

WORKDIR /app

# SEMPRE npm install (tollerante, no lockfile)
COPY package*.json ./
RUN npm install --no-optional --legacy-peer-deps

# Copia codice
COPY . .

# Build solo se prod
RUN npm run build || true

EXPOSE 3000

# CMD intelligente: dev/prod automatico
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = 'production' ]; then npm run start:prod; else npm run start:dev; fi"]
