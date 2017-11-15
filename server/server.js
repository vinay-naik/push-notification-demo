(function() {
	'use strict';

	var fs 			= require('fs');
	var index 		= require('./routes/index');
	var users 		= require('./routes/users');
	var config 		= require('./config');

	var express 	= require('express');
	var app 		= express();
	var server 		= require('http').createServer(app)
	var bodyParser 	= require('body-parser');

	var mongoose 	= require('mongoose');
	mongoose.connect(config.database, { useMongoClient: true });
	mongoose.Promise = global.Promise;

	app.set('view engine', 'html');
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	app.use(express.static(__dirname + '/../client'));
	app.set('appPath', 'client');
	require('./routes')(app);

	server.listen(config.port, function () {
		console.log("In started");
	});

	var io = require('socket.io')(server);
	
	var socket = require('./socket')(io);
	
})();