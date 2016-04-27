var express = require( 'express' );
var bodyParser = require( 'body-parser' );

var app = express();
var expressWs = require( 'express-ws' )( app );

app.use( express.static( 'public' ) );
app.use( bodyParser.json() );

app.set( 'views', __dirname + '/views' );
app.engine( 'html', require( 'ejs' ).renderFile );

/**
 * Handle static assets (HTML view)
 */
app.get( '/', function ( req, res ) {
	res.render( 'index.html' );
} );

/**
 * Subscribe a new listener
 */
app.ws( '/sub', function( ws, req ) {

} );
var subscribers = expressWs.getWss( '/sub' );

/**
 * Pass any POSTED WS data through to subscribed WS listeners
 */
app.post( '/pipe', function( req, res ) {
	subscribers.clients.forEach( function( client ) {
		client.send( JSON.stringify( req.body ) );
	} );

	res.end();
} );

/**
 * Start listening for web requests
 */
app.listen( 3000, function () {
	console.log('Example app listening on port 3000!');
} );