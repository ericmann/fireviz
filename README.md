FireViz
=======

Twitter firehose sentiment visualization experiment.

Requirements
------------

First and foremost, you'll need access to the Twitter API. Create an app, then copy `/front-app/.env.example` to `/front-app/.env` and set your API keys as appropriate.

Building
--------

This project depends on:
- Composer for PHP dependencies
- Node for JS dependencies
- Docker for containerization

Run `composer install` in both `/front-app` and `/worker`.
Run `npm install` in `/browser`

I highly recommend you download and install [Docker Toolbox](https://www.docker.com/products/docker-toolbox) for projects like this. The Kitematic UI makes managing the stack super easy.

Once Docker Toolbox is installed, launch a Docker terminal from Kitematic. In this terminal, CD into the `Iteration 1` directory and run `docker-compose up`. This will spin up your various containers.

Now go to http://192.168.99.100:3000/ in a browser (your VM's IP might be different than mine was) and you'll see the animated browser interface.