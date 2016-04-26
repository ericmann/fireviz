FROM ericmann/php:7.0bcmath

MAINTAINER eric@eamann.com

# Copy the app files into the appropriate location
COPY vendor /var/www/html/vendor
COPY src /var/www/html/src
COPY app.php /var/www/html

WORKDIR /var/www/html

CMD ["php", "./app.php"]