FROM node:16-alpine

WORKDIR /app

RUN apk update && apk add openssh-keygen

# add app
COPY . ./
RUN npm install --quiet

# start app
CMD ["npm", "start"]