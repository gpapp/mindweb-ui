#From google/nodejs-runtime:latest
From nginx:latest

ADD index.html bower.json package.json /usr/share/nginx/html/
ADD app/ /usr/share/nginx/html/app/
ADD app/ /usr/share/nginx/html/images/

EXPOSE 2003:80
