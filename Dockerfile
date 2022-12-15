# Fetching the latest node image on apline linux
FROM node:alpine AS development

# Declaring env
ENV NODE_ENV development

# Setting up the work directory
WORKDIR /cleverhires-backend

# Installing dependencies
COPY ./package.json /cleverhires-backend
RUN npm install

# Copying all the files in our project
COPY . .

# Starting our application
CMD sudo pm2 start index.js --name=backend