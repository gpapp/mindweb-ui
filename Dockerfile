From mindweb/webserver-base:latest

USER root
ADD . /var/www/
RUN chown -R www-data /var/www/

USER www-data
RUN npm install

USER root
ENTRYPOINT ["service", "nginx", "start"]
EXPOSE 80
