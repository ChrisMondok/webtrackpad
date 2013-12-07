function connect() {
	if ((typeof WebSocket) == "undefined")
		alert("Websockets not supported");
	else
	{
		var socket = new WebSocket(window.location.href.replace('http://','ws://'));
		socket.addEventListener('open', onConnectionEstablished.bind(this,socket));
		socket.addEventListener('error', function(e){alert("Connection error");});
		socket.addEventListener('close', function(){alert("Connection closed");});
	}
}

function handleWith(callback, e) {
	callback(e);
	if(event.preventDefault)
		event.preventDefault();
	if(event.stopPropagation)
		event.stopPropagation();
	return false;
}

function distance(x1,y1,x2,y2) {
	return Math.sqrt(
		Math.pow(x2 - x1,2) + Math.pow(y2 - y1,2)
	);
}

function getCenter(touches) {
	var x = 0; y = 0;

	for(var i = 0; i < touches.length; i++) {
		x += touches[i].pageX;
		y += touches[i].pageY;
	}

	return {x:x,y:y};
}

function onConnectionEstablished(socket) {
	var dragging = false;
	var start = {x:0, y:0};
	var last = {x:0, y:0};
	var touches = [];
	var lastDistance = 0;
	var center = null;

	var remote = new Remote(socket);

	var trackpad = document.getElementById('trackpad'),
		leftclick = document.getElementById('leftclick'),
		rightclick = document.getElementById('rightclick');

	trackpad.addEventListener('mousedown', handleWith.bind(this,function(m) {
		dragging = true;
		start={x:m.x, y:m.y};
		last={x:m.x, y:m.y};
	}));

	trackpad.addEventListener('touchmove', handleWith.bind(this, function(t) {
		touches = t.targetTouches;
		if(touches.length == 2) {
			var dist = distance(
				touches[0].pageX, touches[0].pageY,
				touches[1].pageX, touches[1].pageY
			);

			if(lastDistance) {
				if(Math.abs(lastDistance - dist) > 20) {
					remote.pressKey(17);
					var button = (dist > lastDistance ? 4 : 5)
					remote.pressButton(button);
					remote.releaseButton(button);
					remote.releaseKey(17);
					lastDistance = dist;
				}
			}
			else
				lastDistance = dist;
		}
		if(touches.length == 3) {
			var c = getCenter(touches);
			if(center) {
				if(Math.abs(c.x - center.x) > 50) {
					var button = c.x > center.x ? 6 : 7;
					remote.pressButton(button);
					remote.releaseButton(button);
					center.x = c.x;
				}
				if(Math.abs(c.y - center.y) > 50) {
					var button = c.y > center.y ? 4 : 5;
					remote.pressButton(button);
					remote.releaseButton(button);
					center.y = c.y;
				}
			}
			else
				center = c;
		}
	}));

	trackpad.addEventListener('touchend', handleWith.bind(this, function(t) {
		touches = [];
		lastDistance = 0;
		center = null;
	}));

	trackpad.addEventListener('mouseup', handleWith.bind(this,function(m) {
		dragging = false;

		if(m.x == start.x && m.y == start.y) {
			remote.pressButton(m.which);
			remote.releaseButton(m.which);
		}
	}));

	trackpad.addEventListener('mousemove', handleWith.bind(this,function(mouseEvent) {
		if(dragging & touches.length < 2) {
			var x = mouseEvent.x - last.x,
				y = mouseEvent.y - last.y;

			remote.moveMouse(x,y);

			last.x = mouseEvent.x;
			last.y = mouseEvent.y;
		}
	}));

	trackpad.addEventListener('keydown', handleWith.bind(this,function(keyboardEvent) {
		remote.pressKey(keyboardEvent.keyCode);
	}));

	trackpad.addEventListener('keyup', handleWith.bind(this,function(keyboardEvent) {
		remote.releaseKey(keyboardEvent.keyCode);
	}));

	trackpad.addEventListener('mousewheel', handleWith.bind(this,function(wheelEvent){
		var button;
		if(wheelEvent.hasOwnProperty('wheelDeltaX') && wheelEvent.wheelDeltaX != 0) {
			button = wheelEvent.wheelDeltaX > 0 ? 6 : 7;
		}
		else
			button = (wheelEvent.wheelDelta > 0 ? 4 : 5);
		remote.pressButton(button);
		remote.releaseButton(button);
	}));

	leftclick.addEventListener('mousedown', handleWith.bind(this,function(click) {
		remote.pressButton(1);
	}));

	leftclick.addEventListener('mouseup', handleWith.bind(this,function(click) {
		remote.releaseButton(1);
	}));

	rightclick.addEventListener('mousedown', handleWith.bind(this,function(click) {
		remote.pressButton(3);
	}));

	rightclick.addEventListener('mouseup', handleWith.bind(this,function(click) {
		remote.releaseButton(3);
	}));

	trackpad.addEventListener('contextmenu', function(cm) {
		event.preventDefault();
	});

	trackpad.focus();
}

window.addEventListener('load', connect);
