FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i 

COPY dist ./dist

LABEL org.opencontainers.image.source https://github.com/codeparceorg/ms-express-auth

CMD ["npm", "run", "start"]
