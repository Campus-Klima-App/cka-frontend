# pull official base image
FROM node:13.12.0-alpine

# set working directory for dockerfile
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install react-scripts@3.4.1 -g

# add app
COPY . ./

# start app
CMD ["npm", "start"]

## Later in console:
# docker build -t sample:dev .

# docker run \
#     -it \
#     --rm \
#     -v ${PWD}:/app \
#     -v /app/node_modules \
#     -p 80:3000 \
#     -e CHOKIDAR_USEPOLLING=true \
#     sample:dev