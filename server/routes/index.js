(function () {
	'use strict';

	module.exports = function (app) {

		// API
		// app.use('/api/users', require('./api/users'));
		// app.use('/api/companies', require('./api/companies'));
		// app.use('/api/issues', require('./api/issues'));

		// // Auth
		// app.use('/auth', require('./auth'));

		// //fetchCompany details Api
		// app.use('/companiesFetch', require('./crons'));

		// //Mailer
		// app.use('/mailer', require('./mailer'));


		// app.route('/:url(api|app|bower_components|assets)/*')
		//     .get(function (req, res) {
		//         res.status(404).end();
		// });

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
