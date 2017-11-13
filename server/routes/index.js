(function () {
	'use strict';

	module.exports = function (app) {

		
		// // Auth
		app.use('/api/auth', require('../api/auth'));
		app.use('/api/notification', require('../api/notifications'));

		app.route('/dashboard').get(function (req, res) {
			res.sendFile(
				app.get('appPath') + '/dashboard.html',
				{ root: __dirname + "/../../" }
			);
		});

		app.route('/*').get(function (req, res) {
			console.log(__dirname + "/../../");
			console.log(app.get('appPath'));
			res.sendFile(
				app.get('appPath') + '/login.html',
				{ root: __dirname + "/../../" }
			);
		});

	};
})();
