(function() {
	'use strict';

	var populateMainNotification = function (data) {
		console.log(data);
	};

	$(document).ready(function() {
		var socket = io('http://localhost:3000');
		
		socket.on('news', populateMainNotification);
		

	});
	// socket.on('yolo', function (data) {
	// 	console.log("MAKA NAKA GO");
	// 	// socket.emit('my other event', { my: 'data' });
	// });
})();