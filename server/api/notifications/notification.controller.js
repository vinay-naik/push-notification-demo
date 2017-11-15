/**
 * Created by Vinay Naik on 14/11/17.
 * @author Vinay Naik
 * @fileOverview javascript file
 */
(function () {
	'use strict';

	// var _ = require('lodash');
	var moment 			= require('moment');
	var Notifications 	= require('./notification.model');
	var config 			= require('../../config');
	var jwt 			= require('jsonwebtoken');

	var handleError = function (res, err) {
		return res.status(500).json({status: 500, message: 'Internal server error.'});
	}

	/**
	 * @api {post} /notification Fetches all notifications for current user
	 * @apiVersion 0.1.0
	 * @apiName FetchNotifications
	 * @apiDescription Fetches all notifications.
	 * @apiGroup Notification
	 *
	 */
	exports.fetch = function (req, res) {
		var limit 	= req.query.limit  || 20;
		var page 	= req.query.page || 1;

		Notifications.find({'user_id' : req.user._id})
		.limit(limit)
		.skip(limit * (page-1))
		.sort({
			unread	: 'desc',	//get unread notifications first
			created	: 'desc'	//get only the newest
		})
		.exec(function(err, notifications) {
			if (err) { 
				return handleError(res, err); 
			}
			Notifications.count({'user_id' : req.user._id, 'unread': true}).exec(function(err, notificationCount) {
				if (err) { return handleError(res, err); }
				console.log(notificationCount);
				return res.status(200).json({status: 200, message: 'Successfully fetched notifications.', data: notifications, unreadCount: notificationCount});
			})
		});
	};

	/**
	 * @api {post} /notification Updates all notifications of the user.
	 * @apiVersion 0.1.0
	 * @apiName UpdateNotifications
	 * @apiDescription Updates all notifications.
	 * @apiGroup Notification
	 *
	 */
	exports.update = function (req, res) {
		var limit 		= req.query.limit  || 10;
		var page 		= req.query.page || 1;
		var updateTo 	= req.body;
		Notifications.update({'user_id' : req.user._id}, updateTo, {multi: true}, function(err, notification) {
			if (err) { return handleError(res, err); }
			return res.status(200).json({status: 200, message: 'Successfully updated notifications.'});
		});
	};
})();
