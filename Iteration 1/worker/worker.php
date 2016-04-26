<?php
require 'vendor/autoload.php';

use PhpAmqpLib\Message\AMQPMessage;

/**
 * Process a single message
 *
 * @param AMQPMessage $message
 */
$process = function( AMQPMessage $message ) {
	$body = json_decode( $message->body, true );
	$tweet = $body['message'];

	$client = new GuzzleHttp\Client();
	$response = $client->request(
		'POST',
		'http://sentiment.vivekn.com/api/text/',
		[
			'txt' => $tweet
		]
	);

	$response_body = $response->getBody();
	$decoded = json_decode( $response_body, true );

	echo strtolower( $decoded['sentiment'] ) . ' : ' . $body['location'];
};

// Start main engines
$processor = new RabbitMQQueue();
$processor->processQueue( $process );