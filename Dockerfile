FROM node:12 as build

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production

FROM node:12-alpine

COPY . .
EXPOSE 3001
CMD [ "npm", "start" ]