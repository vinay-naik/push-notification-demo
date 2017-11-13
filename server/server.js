(function() {
	'use strict';

	var fs = require('fs');
	var index = require('./routes/index');
	var users = require('./routes/users');

	var express = require('express');
	var app = express();
	var server = require('http').createServer(app)
	var bodyParser = require('body-parser');
	// var mongoose = require('mongoose');

	app.set('view engine', 'html');
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	app.use(express.static(__dirname + '/../client'));
	app.set('appPath', 'client');
	require('./routes')(app);

	server.listen(3000, function () {
		console.log("In started");
	});



	var io = require('socket.io')(server);
	io.on('connection', function (socket) {
		console.log("In socket");
		setInterval(function() {
			var tempImages = [
				"https://i.pinimg.com/originals/7c/c7/a6/7cc7a630624d20f7797cb4c8e93c09c1.png",
				"https://upload.wikimedia.org/wikipedia/commons/8/87/Avatar_poe84it.png",
				"https://vignette.wikia.nocookie.net/thinknoodles/images/7/7c/Avatar.png/revision/latest?cb=20130719170211",
				"http://www.clipartsfree.net/vector/large/Bassell_Avatar_Fabricatorz_Vector_Clipart.png"
			];
			var index = Math.floor(((Math.random()) * 100 % 4));

			var tempNames = [
				"Vinay Naik",
				"Dharmesh Satyanarayan",
				"Ramesh Rajan",
				"Raghu Sudankumar",
				"John Doe",
				"Sooraj Prabhu"
			];

			var index2 = Math.floor(((Math.random()) * 100 % 6));

			var tempActions = [
				'commented on your profile',
				'tagged you in an inmage',
				'poked you',
				'mentioned you in a comment',
				'commented on your last video',
			];
			
			var index3 = Math.floor(((Math.random()) * 100 % 5));
			socket.emit('notification', { image_url: tempImages[index], name : tempNames[index2] , action : tempActions[index3]});

		}, 2000);

		socket.on('disconnect', function () {
			io.emit('user disconnected');
		});
	});
})();