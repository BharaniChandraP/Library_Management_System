FROM node:18

WORKDIR /usr/src/app

# Copy package.json and package-lock.json specifically
COPY package.json ./
COPY package-lock.json ./ 

# If you don't have a lock file yet, just use: COPY package.json ./

RUN npm install

COPY . .

EXPOSE 5001

CMD [ "node", "src/app.js" ]