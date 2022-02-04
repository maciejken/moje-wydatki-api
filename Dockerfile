FROM node:16-alpine

WORKDIR /app
COPY . ./
RUN npm install -g npm@latest
RUN npm install --only=prod
RUN npm run build

# start app
CMD ["npm", "start"]