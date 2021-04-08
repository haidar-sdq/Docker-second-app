FROM node:15.14.0-alpine

ENV MONGO_DB_USERNAME=root \
    MONGO_DB_PWD=root

# set default dir so that next commands executes in /home/app dir
WORKDIR /home/app

COPY ./app .

# will execute npm install in /home/app because of WORKDIR
RUN npm install

# no need for /home/app/server.js because of WORKDIR
CMD ["node", "server.js"]

