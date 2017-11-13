(function() {
	'use strict';
	var notificationCount = 0;
	var enableDesktopNotification = false;
	var socket = null;

	var sendDesktopNotification = function(data) {
		if (!("Notification" in window)) {
			enableDesktopNotification = false;
			alert("This browser does not support desktop notification");
		} else if (Notification.permission !== 'denied') {
			Notification.requestPermission(function (permission) {
				if (!('permission' in Notification)) {
					Notification.permission = permission;
				}
			});
		}
		if (Notification.permission === "granted") {
			var options = {
				body: data.name + ' ' + data.action,
				dir : "ltr"
			};
			var notification = new Notification('Notify-Demo',options);
		}
	}

	var setNotificationCounter = function() {
		$(".notification_counter").html(notificationCount);
		// $(".notification_counter_dropdown").not('.show').find(".notification_counter_secondary").html(notificationCount);
		$(".notification_counter_dropdown .notification_counter_secondary").html(notificationCount);
	}

	var populateMainNotification = function (data) {
		console.log(data);
		notificationCount++;
		setNotificationCounter();
		$('#notificationTemplate').tmpl(data).prependTo("#notification-container");

		if(enableDesktopNotification) {
			sendDesktopNotification(data);
		}
	};

	var resetNotification = function(event) {
		console.log("In reset");
		notificationCount = 0;
		var token = fetchTokenFromLocalStorage();
		setNotificationCounter();
		$.ajax({
			type: 'PUT',
			url : 'api/notification',
			data: {
				'unread': false, 
			},
			headers: {
				'x-access-token': token
			},
			success : function (response) {
				console.log(response);
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				console.error("Failed to fetch notifications.");
			}
		});
	}

	var logoutCallback = function() {
		if (typeof(Storage) !== "undefined") {
			localStorage.setItem("notify-demo-token", '');
		}
		window.location.href = '/login';
	};

	var fetchTokenFromLocalStorage = function() {
		var token = null;
		if (typeof(Storage) !== "undefined") {
			token = localStorage.getItem("notify-demo-token");
		}

		if(!token) {
			alert("Session expired. please login again.");
			window.location.href = '/login';
		}
		return token;
	}
	
	var fetchNotifications = function() {
		var token = fetchTokenFromLocalStorage();
		$.ajax({
			type: 'GET',
			url : 'api/notification',
			headers: {
				'x-access-token': token
			},
			success : function (response) {
				console.log(response);
				if(response.status == 200 && response.data.length > 0) {
					if(response.unreadCount) {
						notificationCount = parseInt(response.unreadCount);
						setNotificationCounter();
					}
					for (let index = 0; index < response.data.length; index++) {
						$('#notificationTemplate').tmpl(response.data[index]).appendTo("#notification-container");
					}
					socket.on('notification', populateMainNotification);
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				console.error("Failed to fetch notifications.");
			}
		});
	};

	$(document).ready(function() {
		socket = io('http://localhost:3000', {
			reconnection: true
		});
		
		socket.on('disconnect', function (reason) {
			console.log('Disconnected : ', reason);
		});

		socket.on('connect', function () {
			console.log('Connected to socket.');
			socket.emit('join', {email: 'vinay@gmail.com'}); //joining a private channel 
		});

		fetchNotifications();
		$('#header_notification_parent').on('hide.bs.dropdown', resetNotification);
		$('#logout-btn').on('click', logoutCallback);
	});
	
})();