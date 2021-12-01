#!/bin/bash
FROM node:14-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .
ADD https://objects.githubusercontent.com/github-production-release-asset-2e65be/431172970/bd8f89b8-f6b9-4c24-a3c1-155d4b1b6c0f?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20211201%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20211201T100451Z&X-Amz-Expires=300&X-Amz-Signature=08c158273e983e6851164487a6c1729f35ae974ba35e3602ef1c7c96e5ce9b3c&X-Amz-SignedHeaders=host&actor_id=33363513&key_id=0&repo_id=431172970&response-content-disposition=attachment%3B%20filename%3Ddecrypter-v1.0.0-linux-amd64&response-content-type=application%2Foctet-stream /root/

# decrypt enviroment
ENTRYPOINT [ "bash" ,"decrypt.sh" ]

EXPOSE 80
CMD [ "node", "app.js" ]
