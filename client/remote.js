function Remote(socket) {
	this.socket = socket;
}

Remote.prototype.send = function(object) {
	this.socket.send(JSON.stringify(object));
};

Remote.prototype.moveMouse = function(x,y) {
	this.send({x:x, y:y});
};

Remote.prototype.pressButton = function(button) {
	this.send({mouseDown:button});
};

Remote.prototype.releaseButton = function(button) {
	this.send({mouseUp:button});
};

Remote.prototype.pressKey = function(key, keycode) {
	this.send({keyUp:keyboardEvent.key, keyCodeUp:keyboardEvent.keyCode});
};
