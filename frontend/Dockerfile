FROM node:16 as builder
WORKDIR /app
COPY . .
RUN yarn set version stable
RUN yarn install
RUN yarn build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
# COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build . 

ENTRYPOINT ["nginx", "-g", "daemon off;"]
