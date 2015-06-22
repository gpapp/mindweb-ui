From google/nodejs:latest
#From nginx:latest
RUN npm cache clean -fI
RUN npm install -g n
RUN n stable

RUN apt-get update
RUN apt-get install apt-utils -y
RUN apt-get install nginx -y
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
RUN sed -i 's+root .*$+root /var/www/;+; s+try_files \$uri \$uri/ /index.html;+try_files \$uri \$uri/ \= 404;+' /etc/nginx/sites-enabled/default 

ADD index.html .bowerrc bower.json package.json /var/www/
ADD app/ /var/www/app/
ADD images/ /var/www/images/

WORKDIR  /var/www/
RUN npm install --unsafe-perm

CMD service nginx start
#ENTRYPOINT ["service", "nginx", "start"]
EXPOSE 80
