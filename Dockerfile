FROM node:16-alpine

WORKDIR /app

# add app
COPY . ./
RUN npm install --quiet

# start app
CMD ["npm", "start"]