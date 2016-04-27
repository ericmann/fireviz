<?php
require 'vendor/autoload.php';

// The OAuth credentials you received when registering your app at Twitter
define( 'TWITTER_CONSUMER_KEY', getenv( 'TWITTER_CONSUMER_KEY' ) );
define( 'TWITTER_CONSUMER_SECRET', getenv( 'TWITTER_CONSUMER_SECRET' ) );

// The OAuth data for the twitter account
define( 'OAUTH_TOKEN', getenv( 'OAUTH_TOKEN' ) );
define( 'OAUTH_SECRET',  getenv( 'OAUTH_SECRET' ) );

$sc = new FirehoseConsumer( OAUTH_TOKEN, OAUTH_SECRET, Phirehose::METHOD_SAMPLE );
$sc->setLang( 'en' );
$sc->consume();