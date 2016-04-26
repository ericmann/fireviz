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

		$data = json_decode( $status, true );
		if ( is_array( $data ) && isset( $data[ 'text' ] ) ) {
			// I only care about English for now ...
			if ( 'en' !== $data['lang'] ) {
				return;
			}

			$body = [
				"message" => $data['text'],
				"location" => $data['location'],
				"hashtags" => $data['entities']['hashtags'],
			];

			$rabbitHandler->sendMessage( json_encode( $body ) );
		}
	}
}