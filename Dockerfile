From google/nodejs:latest
#From nginx:latest

RUN apt-get update
RUN apt-get install apt-utils -y
RUN apt-get install nginx -y
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
RUN sed -i 's+root .*$+root /var/www/;+' /etc/nginx/sites-enabled/default 

ADD index.html .bowerrc bower.json package.json /var/www/
ADD app/ /var/www/app/
ADD app/ /var/www/images/

WORKDIR  /var/www/
RUN npm install --unsafe-perm

CMD service nginx start
#ENTRYPOINT ["service", "nginx", "start"]
EXPOSE 80
