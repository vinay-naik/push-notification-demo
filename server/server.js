var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');


function handler(req, res) {
	// console.log(__dirname);
	fs.readFile(__dirname + '/../client/index.html',
		function (err, data) {
			if (err) {
				res.writeHead(500);
				return res.end('Error loading index.html');
			}

			res.writeHead(200);
			res.end(data);
		});
}

io.on('connection', function (socket) {
	console.log("In socket");
	// setInterval(function() {
		socket.emit('news', { hello: 'world' });
	// }, 2000);

	socket.on('disconnect', function () {
		io.emit('user disconnected');
	});
});

app.listen(3000, function () {
	console.log("YOLO");

});