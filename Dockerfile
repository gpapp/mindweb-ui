From mindweb/webserver-base:latest

USER root
ADD . /var/www/
RUN chown -R www-data /var/www/

USER www-data
RUN npm install

USER root
CMD service nginx start
#ENTRYPOINT ["service", "nginx", "start"]
ENTRYPOINT ["/var/www/register.sh"]
EXPOSE 80
