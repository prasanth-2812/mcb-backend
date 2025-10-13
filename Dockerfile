FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build || true
EXPOSE 4000
CMD ["sh", "-c", "[ -f dist/server.js ] && node dist/server.js || node src/server.ts" ]
