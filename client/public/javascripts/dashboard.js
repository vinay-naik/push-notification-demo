(function() {
	'use strict';
	var notificationCount = 0;
	var enableDesktopNotification = false;

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

	var populateMainNotification = function (data) {
		console.log(data);
		notificationCount++;
		$(".notification_counter").html(notificationCount);
		// $(".notification_counter_dropdown").not('.show').find(".notification_counter_secondary").html(notificationCount);
		$(".notification_counter_dropdown .notification_counter_secondary").html(notificationCount);
		
		$('#notificationTemplate').tmpl(data).prependTo("#notification-container");

		if(enableDesktopNotification) {
			sendDesktopNotification(data);
		}
	};

	var resetNotification = function(event) {
		console.log("In reset");
		notificationCount = 0;
		$(".notification_counter").html(notificationCount);
	}

	$(document).ready(function() {
		var socket = io('http://localhost:3000');
		// notificationCount = localstorage. 
		socket.on('notification', populateMainNotification);
		
		$('#header_notification_parent').on('hide.bs.dropdown', resetNotification)
	});
	
})();