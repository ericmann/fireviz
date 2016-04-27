var markersArray = [];
var map = null;
var fetchedData = Array();
var refreshTimerID = null;
var current_data = 'geowpcom';
var request = null;
var is_ajax_running = false;
var is_css3_transition_supported = false;
function isCSS3TransitionSupported() {
	var s = document.documentElement.style;
	return (typeof(s.WebkitTransition) == 'string' || typeof(s.MozTransition) == 'string' || typeof(s.OTransition) == 'string' || typeof(s.transition) == 'string');
}
function CustomMarker( latlng, size, type, map ) {
	this.latlng_ = latlng;
	this.size_ = size;
	this.type_ = type;
	this.setMap( map );
}
CustomMarker.prototype = new google.maps.OverlayView();
CustomMarker.prototype.draw = function () {
	var me = this;
	var div = this.div_;
	if ( ! div ) {
		div = this.div_ = document.createElement( 'DIV' );
		div.style.border = "solid 1px #fff";
		div.style.position = "absolute";
		div.style.paddingLeft = "0px";
		div.style.paddingTop = "0px";
		div.style.cursor = 'pointer';
		div.style.width = this.size_ + "px";
		div.style.height = this.size_ + "px";
		if ( is_css3_transition_supported == false ) {
			div.className = "sparkle-marker " + this.type_;
			div.style.display = 'none';
		} else {
			div.className = "sparkle-marker " + this.type_ + " shown";
		}
		var panes = this.getPanes();
		panes.overlayImage.appendChild( div );
		if ( is_css3_transition_supported == false ) {
			jQuery( this.div_ ).fadeIn( 250, 'swing' );
		}
	}
	var point = this.getProjection().fromLatLngToDivPixel( this.latlng_ );
	if ( point ) {
		div.style.left = point.x + 'px';
		div.style.top = point.y + 'px';
	}
};
CustomMarker.prototype.reDraw = function ( new_size, new_type ) {
	jQuery( this.div_ ).stop().width( new_size ).attr( 'class', 'sparkle-marker ' + new_type ).height( new_size ).fadeIn( 250, 'swing' ).fadeOut( 1000, 'swing' );
}
CustomMarker.prototype.remove = function () {
	if ( this.div_ ) {
		var _div = this.div_;
		if ( is_css3_transition_supported ) {
			jQuery( this.div_ ).bind( "webkitTransitionEnd oTransitionEnd transitionend", function () {
				_div.parentNode.removeChild( _div );
				_div = null;
			} );
			jQuery( this.div_ ).removeClass( 'shown' );
			jQuery( this.div_ ).addClass( 'hidden' );
		} else {
			jQuery( this.div_ ).fadeOut( 2000, 'swing', function () {
				_div.parentNode.removeChild( _div );
				_div = null;
			} );
		}
		this.div_ = null;
	}
};
CustomMarker.prototype.getPosition = function () {
	return this.latlng_;
};
function initialize() {
	is_css3_transition_supported = isCSS3TransitionSupported();
	var stylez = [{ featureType: "road", stylers: [{ visibility: "off" }] }, {
		elementType: "labels",
		stylers:     [{ visibility: "off" }]
	}, {
		featureType: "water",
		elementType: "geometry",
		stylers:     [{ saturation: 14 }, { lightness: - 69 }, { hue: "#0091ff" }]
	}, {}, { featureType: "administrative", stylers: [{ visibility: "off" }] }, {
		featureType: "landscape",
		stylers:     [{ visibility: "off" }]
	}, { featureType: "poi", stylers: [{ visibility: "off" }] }, {
		featureType: "transit",
		stylers:     [{ visibility: "off" }]
	}, {
		featureType: "landscape.natural",
		elementType: "geometry",
		stylers:     [{ visibility: "simplified" }, { invert_lightness: true }, { saturation: 77 }, { lightness: 2 }, { hue: "#00b2ff" }]
	}];
	var customMapType = new google.maps.StyledMapType( stylez, { name: 'Name' } );
	var mapOptions = {
		center:                new google.maps.LatLng( 43.012924, 0.0 ),
		zoom:                  2,
		minZoom:               2,
		mapTypeId:             'Border View',
		mapTypeControlOptions: { mapTypeIds: ['Border View'] },
		panControl:            false,
		zoomControl:           false,
		mapTypeControl:        false,
		scaleControl:          false,
		streetViewControl:     false,
		overviewMapControl:    false
	};
	map = new google.maps.Map( document.getElementById( "map_canvas" ), mapOptions );
	map.mapTypes.set( 'Border View', customMapType );
	jQuery( "#loading" ).hide();
	jQuery( "#menu" ).show();
	google.maps.event.addListener( map, 'zoom_changed', function () {
		refreshDataOnTheScreen();
	} );
}
function addMarker( location, size, type ) {
	var marker = new CustomMarker( location, size, type, map );
	markersArray.push( marker );
}
function deleteOverlays() {
	if ( markersArray ) {
		for ( i in markersArray ) {
			markersArray[i].setMap( null );
		}
		markersArray.length = 0;
	}
}
function handlePush( event ) {
	if ( '' == event.data  ) {
		return;
	}

	// Decode message
	var message = JSON.parse( event.data );
	var geocoder =  new google.maps.Geocoder();
	geocoder.geocode( { 'address': message.location}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			var latitude = results[0].geometry.location.lat();
			var longitude = results[0].geometry.location.lng();

			var point = {
				lat: latitude,
				size: 2,
				'long': longitude,
				'type': message.sentiment
			};
			fetchedData.push( point );
		} else {
			// No location, so we don't care!
		}
	});
}
function openSocket() {
	var connection = new WebSocket( 'ws://' + window.location.hostname + ':' + window.location.port + '/sub' );
	connection.onmessage = handlePush;
	connection.onerror = function() {
		connection.close();
		connection = false;
		openSocket();
	};
	refreshDataOnTheScreen();
}
function refreshDataOnTheScreen() {
	clearTimeout( refreshTimerID );
	deleteOverlays();
	if ( fetchedData.length > 0 ) {
		for ( var currentIndex = 0; currentIndex < fetchedData.length, currentIndex < 100; currentIndex ++ ) {
			var currentMarker = fetchedData.shift();
			queue.push( currentMarker );
		}
	}
	refreshTimerID = setTimeout( "refreshDataOnTheScreen()", 30 );
}
function quantize_coordinate( coord, granularity ) {
	return granularity * Math.round( coord / granularity );
}
function make_coordinate_grid( granularity ) {
	grid = new Array();
	for ( x = - 180; x <= 180; x += granularity ) {
		grid[quantize_coordinate( x, granularity )] = new Array();
		for ( y = - 90; y <= 90; y += granularity ) {
			grid[quantize_coordinate( x, granularity )][quantize_coordinate( y, granularity )] = 0;
		}
	}
	return grid;
}
var queue = new Array();
var granularity = 10;
var grid = make_coordinate_grid( granularity );
function drawThread( limit, delay ) {
	var _limit = limit;
	var decay = 250;
	var e = Math.round( new Date().getTime() / decay );
	var bounds = map.getBounds();
	var zoom = map.getZoom();
	while ( _limit -- > 0 ) {
		var point = queue.shift();
		if ( ! point ) {
			continue;
		}
		var pos = new google.maps.LatLng( point.lat, point['long'], true );
		if ( zoom > 2 && bounds && ! bounds.isEmpty() && ! bounds.contains( pos ) ) {
			continue;
		}
		var qx = quantize_coordinate( parseFloat( point['long'] ), granularity );
		var qy = quantize_coordinate( parseFloat( point.lat ), granularity );
		if ( grid[qx][qy] < e ) {
			grid[qx][qy] = e + parseInt( point.size ) + 1;
		} else {
			grid[qx][qy] += parseInt( point.size ) + 1;
		}
		var size = 1 + point.size;
		addMarker( new google.maps.LatLng( point.lat, point['long'], true ), size, point.type );
	}
	window.setTimeout( function () {
		drawThread( limit, delay );
	}, delay );
}