(function () {
	'use strict';

	var Notifications 	= require('../api/notifications/notification.model');
	var Users 			= require('../api/users/users.model');
	var config 			= require('../config/');
	var moment 			= require('moment');
	var jwt 			= require('jsonwebtoken');

	var getRandomImages = function () {
		var tempImages = [
			"https://i.pinimg.com/originals/7c/c7/a6/7cc7a630624d20f7797cb4c8e93c09c1.png",
			"https://upload.wikimedia.org/wikipedia/commons/8/87/Avatar_poe84it.png",
			"https://vignette.wikia.nocookie.net/thinknoodles/images/7/7c/Avatar.png/revision/latest?cb=20130719170211",
			"http://www.clipartsfree.net/vector/large/Bassell_Avatar_Fabricatorz_Vector_Clipart.png"
		];
		var index = Math.floor(((Math.random()) * 100 % tempImages.length));
		return tempImages[index];
	}

	var getRandomUserNames = function () {
		var tempNames = [
			"Vinay Naik",
			"Dharmesh Satyanarayan",
			"Ramesh Rajan",
			"Raghu Sudankumar",
			"John Doe",
			"Sooraj Prabhu"
		];
		var index = Math.floor(((Math.random()) * 100 % tempNames.length));
		return tempNames[index];
	}

	var getRandomMessages = function () {
		var tempMessages = [
			'commented on your profile',
			'tagged you in an inmage',
			'poked you',
			'mentioned you in a comment',
			'commented on your last video',
		];
		var index = Math.floor(((Math.random()) * 100 % tempMessages.length));
		return tempMessages[index];
	}

	var notifyAllUsersCron = function (io) {
		setInterval(function () {
			Users.find({}).select('_id').exec(function (err, users) {
				if (err) {
					//ignore error
				}
				// console.log(users);
				users.forEach(user => {
					console.log("Sending notification to user : ", user._id);
					var notificationData = {
						image_url	: getRandomImages(),
						name		: getRandomUserNames(),
						message		: getRandomMessages(),
						unread		: true,
						user_id		: user._id,
						created		: moment().format()
					};
					Notifications.create(notificationData, function (err, notification) {
						if (err) {
							console.log('Could not create a notification.');
						}
						delete notificationData.user_id;
						delete notificationData.unread;
						delete notificationData.created;
						io.sockets.in(user._id).emit('notification', notificationData);
					});
				});
			});
		}, 10000);
	}

	module.exports = function (io) {
		notifyAllUsersCron(io);

		//This socket middleware is used to make sure that only an authenticated user can join a channel.
		io.use(function (socket, next) {
			if (socket.handshake.query && socket.handshake.query.token) {
				jwt.verify(socket.handshake.query.token, config.secret, function (err, decoded) {
					if (err) return next(new Error('User authentication error.'));
					socket.decodedToken = decoded;
					next();
				});
			}
			next(new Error('User authentication error.'));
		});

		io.on('connection', function (socket) {
			console.log("In socket");

			socket.on('join', function (data) {
				console.log("In join channel...", socket.decodedToken._id);
				socket.join(socket.decodedToken._id); // making use of socket.io rooms for single user communication
			});

			socket.on('disconnect', function (data) {
				console.log("User Disconnected", data);
				// io.emit('user disconnected');
			});
		});
	}

})();

