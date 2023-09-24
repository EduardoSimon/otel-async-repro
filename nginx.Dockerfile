FROM nginx:1.19

RUN mkdir /etc/nginx/templates
COPY ./nginx/templates /etc/nginx/templates/
