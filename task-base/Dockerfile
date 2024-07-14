FROM node:20
WORKDIR /usr/src/
COPY ./example-service/package*.json ./
RUN npm install
COPY ./example-service/ .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]