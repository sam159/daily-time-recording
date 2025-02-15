FROM node:20-alpine AS build

WORKDIR /build

# install packages first
COPY package* .
RUN npm ci

# copy everything else and run the build
COPY . .
RUN npm run build

FROM busybox:1.37 AS httpd

# add user to run web server as
RUN adduser -D static
USER static
WORKDIR /home/static

# copy build files from the node worker
COPY --from=build /build/dist /home/static

EXPOSE 3000
# run httpd in foreground, verbose, on port 3000
CMD ["busybox", "httpd", "-f", "-v", "-p", "3000"]

