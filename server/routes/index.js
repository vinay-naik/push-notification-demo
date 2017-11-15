/**
 * Created by Vinay Naik on 13/11/17.
 * @author Vinay Naik
 * @fileOverview javascript file
 */
(function () {
	'use strict';

	module.exports = function (app) {

		
		//Auth API
		app.use('/api/auth', require('../api/auth'));
		// Notification API
		app.use('/api/notification', require('../api/notifications'));

		//Next 2 routes are for the frontend. If we implement 
		//a frontend routing mechanism then we will only need to define 
		//one route here to the index page for the frontend
		app.route('/dashboard').get(function (req, res) {
			res.sendFile(
				app.get('appPath') + '/dashboard.html',
				{ root: __dirname + "/../../" }
			);
		});

		app.route('/*').get(function (req, res) {
			res.sendFile(
				app.get('appPath') + '/login.html',
				{ root: __dirname + "/../../" }
			);
		});

	};
})();
