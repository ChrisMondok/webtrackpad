var http = require('http'),
	express = require('express'),
	ws = require('ws'),
	x11 = require('x11');

var keyMap = [];
keyMap[17] = 37 //control;


x11.createClient(function(error,display) {

	if(error) throw error;

	var SENSITIVITY = 2;

	var client = display.client,
		root = display.screen[0].root;

	var handleMessage = function(message) {
		var parsed = JSON.parse(message);
		if(parsed.x || parsed.y) {
			client.QueryPointer(root, function(error,pos) {
				var x = pos.rootX + parsed.x * SENSITIVITY;
				var y = pos.rootY + parsed.y * SENSITIVITY;
				client.WarpPointer(0,root,0,0,0,0,x,y);
			});
		}
		if(parsed.hasOwnProperty('mouseDown')) {
			client.require('xtest', function(Test) {
				Test.FakeInput(Test.ButtonPress, parsed.mouseDown, 0, root, 0, 0);
			});
		}

		if(parsed.hasOwnProperty('mouseUp')) {
			client.require('xtest', function(Test) {
				Test.FakeInput(Test.ButtonRelease, parsed.mouseUp, 0, root, 0, 0);
			});
		}

		if(parsed.hasOwnProperty('keyDown')) {
			client.require('xtest', function(Test) {
				var key = keyMap[parsed.keyDown];
				if(key)
					Test.FakeInput(Test.KeyPress, key, 0, root, 0, 0);
			});
		}

		if(parsed.hasOwnProperty('keyUp')) {
			client.require('xtest', function(Test) {
				var key = keyMap[parsed.keyUp];
				if(key)
					Test.FakeInput(Test.KeyRelease, key, 0, root, 0, 0);
				else
					console.log("Couldn't find "+key);
			});
		}

		if(parsed.hasOwnProperty('info'))
			console.log(parsed.info);
	};

	var app = express();

	var httpServer = http.createServer(app);

	app.use(express["static"](__dirname + '/client'));

	httpServer.listen(9000);

	var wsServer = new ws.Server({server: httpServer});

	wsServer.on('connection', function(ws) {
		console.log("Connected");

		ws.on('message', handleMessage);

		ws.on('error', function(error) {
			console.error(error);
		});

		ws.on('close', function(message) {
			console.log("Close "+message);
		});
	});

});

