# there is an issue with alpine and nodemon, when you change the code, it fails with:
# starting inspector on 0.0.0.0:9229 failed: address already in use
# so we use debian in development
FROM node:10 as dev

WORKDIR /app

COPY . /app

# this image already has yarn, but it's better if we have the latest version
RUN npm i -g yarn

# install all modules
RUN yarn install --frozen-lockfile

# starting point for builder image
FROM node:10 as builder

WORKDIR /app

# get source and all node_modules from dev stage
COPY --from=dev /app /app

RUN yarn build

# starting point for production image
FROM node:10-alpine as prod

WORKDIR /app

# get source from local, build from builder
COPY . /app
COPY --from=builder /app/build /app/build

# install only production packages
# we cannot rely on node_modules from other stages because:
# they use debian, this image is alpine
RUN npm i -g yarn \
  && yarn install --production --frozen-lockfile

CMD ["yarn", "start"]
