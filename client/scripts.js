function connect() {
	if ((typeof WebSocket) == "undefined")
		alert("Websockets not supported");
	else
	{
		var socket = new WebSocket("ws://spire:9000");
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

function onConnectionEstablished(socket) {
	var dragging = false;
	var start = {x:0, y:0};
	var last = {x:0, y:0};

	var remote = new Remote(socket);

	var trackpad = document.getElementById('trackpad'),
		leftclick = document.getElementById('leftclick'),
		rightclick = document.getElementById('rightclick');

	trackpad.addEventListener('mousedown', handleWith.bind(this,function(m) {
		dragging = true;
		start={x:m.x, y:m.y};
		last={x:m.x, y:m.y};
	}));

	trackpad.addEventListener('mouseup', handleWith.bind(this,function(m) {
		dragging = false;

		if(m.x == start.x && m.y == start.y) {
			remote.pressButton(m.which);
			remote.releaseButton(m.which);
		}
	}));

	trackpad.addEventListener('mousemove', handleWith.bind(this,function(mouseEvent) {
		if(dragging) {
			var x = mouseEvent.x - last.x,
				y = mouseEvent.y - last.y;

			remote.moveMouse(x,y);

			last.x = mouseEvent.x;
			last.y = mouseEvent.y;
		}
	}));

	trackpad.addEventListener('keydown', handleWith.bind(this,function(keyboardEvent) {
		remote.pressKey({keyDown:keyboardEvent.key, keyCodeDown:keyboardEvent.keyCode});
	}));

	trackpad.addEventListener('keyup', handleWith.bind(this,function(keyboardEvent) {
		remote.releaseKey({keyUp:keyboardEvent.key, keyCodeUp:keyboardEvent.keyCode});
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
}

window.addEventListener('load', connect);
