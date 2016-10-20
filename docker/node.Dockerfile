FROM node

MAINTAINER Kashav Madan

RUN npm install -g pm2 nodemon

RUN mkdir -p /app

ADD ../package.json /app/
RUN cd /app && \
    npm install

ADD ../. /app
WORKDIR /app

EXPOSE 3000

CMD ["npm", "start", "pm2"]
