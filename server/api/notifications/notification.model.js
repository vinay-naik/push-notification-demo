/**
 * Created by Vinay Naik on 14/11/17.
 * @author Vinay Naik
 * @fileOverview javascript file
 */
(function () {
	'use strict';

	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;

	var NotificationsSchema = new Schema({
		user_id		: {type : Schema.ObjectId, ref: 'User', index: true},
		message		: String,
		image_url	: String,
		name		: String,
		unread		: Boolean,
		created		: Date
	});

	module.exports = mongoose.model('Notifications', NotificationsSchema);
})();
