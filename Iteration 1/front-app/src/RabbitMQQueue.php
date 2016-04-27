<?php

use PhpAmqpLib\Channel\AMQPChannel;
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

class RabbitMQQueue {

	const EXCHANGE = 'tweet_exchange';
	const QUEUE = 'tweets';

	/**
	 * @var $channel AMQPChannel
	 */
	protected $channel;

	/**
	 * @var $connection AMQPStreamConnection
	 */
	public $connection;

	public function __construct() {
		$this->connect();
	}

	/**
	 * Open a connection
	 *
	 * @return bool
	 */
	protected function connect() {
		try {
			$this->connection = new AMQPStreamConnection( 'rabbitmq', 5672, 'user', 'pass' );
			$this->channel = $this->connection->channel();
			$this->channel->queue_declare( self::QUEUE, false, false, false, false );
			$this->channel->exchange_declare( self::EXCHANGE, 'direct', false, false, false );
			$this->channel->queue_bind( self::QUEUE, self::EXCHANGE );
		} catch ( Exception $e ) {
			echo "warning: " . $e->getMessage();
			return false;
		}

		return true;
	}

	/**
	 * Clean up the connection
	 */
	protected function disconnect() {
		$this->channel && $this->channel->close();
		$this->connection && $this->connection->close();
	}

	/**
	 * Get the protected channel
	 *
	 * @return AMQPChannel
	 */
	public function getChannel() {
		return $this->channel;
	}

	/**
	 * Send a message to the RabbitMQ queue
	 *
	 * @param string $message
	 */
	public function sendMessage( string $message ) {
		if ( ! $this->connection->isConnected() ) {
			$this->connect();
		}

		try {
			$msg = new AMQPMessage( $message );
			$this->channel->basic_publish( $msg, self::EXCHANGE );
		} catch ( Exception $e ) {

		}
	}
}