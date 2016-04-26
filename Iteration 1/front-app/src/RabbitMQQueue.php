<?php

use PhpAmqpLib\Channel\AMQPChannel;
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

class RabbitMQQueue {

	/**
	 * @var $channel AMQPChannel
	 */
	protected $channel;

	/**
	 * @var $connection AMQPStreamConnection
	 */
	public $connection;

	public function __construct() {
		try {
			$this->connection = new AMQPStreamConnection( 'rabbitmq', 5672, 'user', 'pass' );
			$this->channel = $this->connection->channel();
		} catch ( Exception $e ) {
			echo "warning: " . $e->getMessage();
			return false;
		}
		return false;
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
	 * @param array $message
	 * @param string $routingKey
	 * @param string $exchange
	 *
	 * @return bool
	 */
	public function sendMessage( array $message, string $routingKey, $exchange = 'critics' ) {
		try {
			if ( $this->channel && $this->connection ) {
				$this->channel = $this->connection->channel();
				$msg = new AMQPMessage( $message );
				$this->channel->basic_publish( $msg, $exchange, $routingKey );

				$this->channel->close();
				$this->connection->close();
			}
		} catch ( Exception $e ) {
			echo "warning: " . $e->getMessage();
			return false;
		}
		return false;
	}
}