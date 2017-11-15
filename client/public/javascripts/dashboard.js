/**
 * Created by Vinay Naik on 13/11/17.
 * @author Vinay Naik
 * @fileOverview javascript file
 */
(function() {
	'use strict';
	var notificationCount = 0;
	var enableDesktopNotification = false;  	//In case you want to also send desktop notifications make this setting true 
	var socket = null;

	/**
	 * This function is used to display desktop notifications.
	 * 
	 * @param object data Contains data to be displayed in the notification 
	 */
	var sendDesktopNotification = function(data) {
		if (!("Notification" in window)) {
			enableDesktopNotification = false;
			console.log("This browser does not support desktop notification");
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

	/**
	 * This function is used to update the notification counter 
	 * on the ui.
	 */
	var setNotificationCounter = function() {
		$(".notification_counter").html(notificationCount);
		$(".notification_counter_dropdown .notification_counter_secondary").html(notificationCount);
	}

	/**
	 * This function is used to populate the notification in the
	 * noification dropdown 
	 * @param {object} data This is the data recieved from the socket 
	 */
	var populateMainNotification = function (data) {
		notificationCount++;
		setNotificationCounter();
		$('#notificationTemplate').tmpl(data).prependTo("#notification-container");

		if(enableDesktopNotification) {
			sendDesktopNotification(data);
		}
	};

	/**
	 * This function will reset the unread notification count to zero.
	 * @param {object} event Javascript event data  
	 */
	var resetNotification = function(event) {
		console.log("In reset");
		notificationCount = 0;
		setNotificationCounter();
		$.ajax({
			type: 'PUT',
			url : 'api/notification',
			data: {
				'unread': false, 
			},
			success : function (response) {
				console.log(response);
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				console.error("Failed to fetch notifications.");
			}
		});
	}

	/**
	 * This function will clear the token and 
	 * log the user out
	 */
	var logoutCallback = function() {
		if (typeof(Storage) !== "undefined") {
			localStorage.setItem("notify-demo-token", '');
		}
		window.location.href = '/login';
	};

	/**
	 * This fucntion fetches the token from localstorage
	 */
	var fetchTokenFromLocalStorage = function() {
		var token = null;

		if (typeof(Storage) !== "undefined") {
			token = localStorage.getItem("notify-demo-token");
		}

		if(token) {
			return token;
		} else {
			alert("Session expired. Please login again.");
			window.location.href = '/login';
		}
	}
	
	/**
	 * This fucntion will fetch the top 10 unread notificatoins 
	 * and the notification count from the database and initiate 
	 * a websocket watch for new notifications 
	 */
	var fetchNotifications = function() {
		$.ajax({
			type: 'GET',
			url : 'api/notification',
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
				}
				socket.on('notification', populateMainNotification);
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				console.error("Failed to fetch notifications. ", XMLHttpRequest.responseJSON.message);
			}
		});
	};

	/**
	 * This function will add animations to all dropdowns woth the class
	 * animate-dropdown. Bootstrap javascript events are used here. 
	 */
	var animateDropdowns = function() {
		$('.animate-dropdown').on('show.bs.dropdown', function(e){
			$(this).find('.dropdown-menu').first().stop(true, true).slideDown(300);
		});
		  
		$('.animate-dropdown').on('hide.bs.dropdown', function(e){
			$(this).find('.dropdown-menu').first().stop(true, true).slideUp(200);
		});
	}

	/**
	 * This is an http interceptor that will add the auth token
	 * to every ajax request header and handle authentication failure errors. 
	 */
	var initializeAjaxInterceptor = function() {
		var token = fetchTokenFromLocalStorage();		
		$.ajaxSetup({
			beforeSend: function (xhr) {
				xhr.setRequestHeader('x-access-token', token)
			},
			statusCode : {
				401: function() {
					alert("Your session has expired. Please log in again.");
					logoutCallback();
				},
				403: function() {
					alert("Could not find your session token. Please log in again.");
					logoutCallback();
				}
			}
		});
	};

	$(document).ready(function() {
		// All our api requests will need authentication in this step. Instead of manually 
		//adding the token every time we will use the global ajax interceptor. This will also
		//take care of logging the user out if a status 401 i.e. token expired is recieved.
		initializeAjaxInterceptor();

		var token = fetchTokenFromLocalStorage();
		socket = io('http://localhost:3000', {
			reconnection: true,
			query: {token: token} //we are sending token to authenticate the user with socket io and connect him to a private channel identified by his user id
		});
		
		socket.on('disconnect', function (reason) {
			console.log('Disconnected : ', reason);
		});

		socket.on('connect', function () {
			console.log('Connected to socket.');
			socket.emit('join'); //joining a private channel 
		});

		fetchNotifications();
		$('#header_notification_parent').on('hide.bs.dropdown', resetNotification); //Here we are waiting for the dropdown close event to reset the notification count to zero.
		$('#logout-btn').on('click', logoutCallback);

		animateDropdowns();
	});
	
})();