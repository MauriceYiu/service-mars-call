FROM nginx:1.12.1-alpine

COPY build /usr/share/nginx/html
#COPY default.conf /etc/nginx/conf.d/default.conf