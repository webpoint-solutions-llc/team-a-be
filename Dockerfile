# Dockerfile
FROM node:22-slim

ENV NODE_ENV development

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .
RUN npx prisma generate

# Your app binds to port 3000 so you'll use the EXPOSE instruction
EXPOSE 5000

CMD [ "npx", "ts-node", "src/server.ts" ]