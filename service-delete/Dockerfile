FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5001 
# Note: You'll change the EXPOSE port number to match the service port
CMD ["npm", "start"]