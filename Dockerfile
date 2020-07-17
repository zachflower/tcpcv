FROM node:12-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose default port
ENV PORT 23
EXPOSE ${PORT}

# Start server
CMD [ "node", "server.js" ]