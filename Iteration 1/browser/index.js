var express = require( 'express' );

var app = express();
var expressWs = require( 'express-ws' )( app );

app.use( express.static( 'public' ) );

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

/**
 * Pass any POSTED WS data through to subscribed WS listeners
 */
app.post( '/pipe', function( req, res ) {
	expressWs.getWss( '/sub' ).clients.forEach( function( client ) {
		client.send( req.body );
	} );

	res.close();
} );

/**
 * Start listening for web requests
 */
app.listen( 3000, function () {
	console.log('Example app listening on port 3000!');
} );