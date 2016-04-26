FROM node:6

MAINTAINER eric@eamann.com

# Copy the app files into the appropriate location
COPY node_modules /var/www/html/node_modules
COPY public /var/www/html/public
COPY views /var/www/html/views
COPY index.js /var/www/html

WORKDIR /var/www/html

CMD ["node", "./index.js"]