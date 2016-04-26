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
			'form_params' => [
				'txt' => $tweet,
			],
		]
	);

	$response_body = $response->getBody()->getContents();
	$decoded = json_decode( $response_body, true );

	// @TODO send websocket ping to Node app
	echo strtolower( $decoded['result']['sentiment'] ) . ' : ' . $body['location'];
};

// Start main engines
$processor = new RabbitMQQueue();
$processor->processQueue( $process );