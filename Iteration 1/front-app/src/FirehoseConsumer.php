<?php

/**
 * Consume the Twitter firehose over OAuth
 */
class FirehoseConsumer extends OauthPhirehose {

	/**
	 * Enqueue just the components of each status the way we need it
	 *
	 * @param string $status
	 */
	public function enqueueStatus( $status ) {

		$rabbitHandler = new RabbitMQQueue();
		/*
		 * In this simple example, we will just display to STDOUT rather than enqueue.
		 * NOTE: You should NOT be processing tweets at this point in a real application, instead they should be being
		 *       enqueued and processed asyncronously from the collection process.
		 */
		$data = json_decode( $status, true );
		if ( is_array( $data ) && isset( $data[ 'user' ][ 'screen_name' ] ) ) {
			echo $data[ 'lang' ] . " : " . $data[ 'user' ][ 'screen_name' ] . ': ' . urldecode( $data[ 'text' ] ) . "\n";

			$body = [
				"user" => $data[ 'user' ][ 'screen_name' ],
				"language" => $data[ 'lang' ],
				"message" => $data[ 'text' ],
				"hashtags" => $data[ 'entities' ][ 'hashtags' ],
			];

			$rabbitHandler->sendMessage( json_encode( $body ), $data[ 'lang' ] . '.tweet', 'tweets' );
		}
	}
}