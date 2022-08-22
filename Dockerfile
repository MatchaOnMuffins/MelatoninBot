FROM node:16-alpine
ENV NODE_ENV production
WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn install
COPY /auth /app/auth
COPY index.js /app/index.js

CMD ["yarn", "start"]
