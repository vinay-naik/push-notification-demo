/**
 * Created by Vinay Naik on 13/11/17.
 * @author Vinay Naik
 * @fileOverview javascript file
 */
(function () {
	'use strict';

	var moment 	= require('moment');
	var Users 	= require('../users/users.model');
	var config 	= require('../../config');
	var jwt 	= require('jsonwebtoken');

	var handleError = function (res, err) {
		return res.status(500).json({status: 500, message: 'Internal server error.'});
	}

	/**
	 * Here we are creating a jwt token to be used for authenticating our stateless api.
	 * @param {object} payload Data to convert to token 
	 */
	var signJWT = function(payload) {
		var token = jwt.sign(payload, config.secret, {
			expiresIn: 86400 // expires in 24 hours
		});
		return token;
	}


	/**
	 * @api {post} /auth/signup Create a new user
	 * @apiVersion 0.1.0
	 * @apiName CreateUsers
	 * @apiDescription Creates a new users.
	 * @apiGroup AUTH
	 */
	exports.signup = function (req, res) {
		if(req.body && !req.body.email) {
			return res.status(400).json({status: 400, message: 'Email id not provided.'});
		} else if(req.body && !req.body.password){
			return res.status(400).json({status: 400, message: 'Password not provided.'});
		}

		Users.findOne({email: req.body.email}, function (err, user) {
			if (err) { 
				return handleError(res, err); 
			}
			if (!user) { 
				var currentDate 		= moment().format();
				var userData 			= req.body;
				userData.name 			= req.body.email.split('@')[0];
				userData.created 		= currentDate;
				userData.modified 		= currentDate;
				userData.last_online 	= currentDate;
				Users.create(userData, function (err, user) {
					if (err) { 
						return handleError(res, err); 
					}

					var tempUser = Object.assign({}, user); //user object is forxez and cannot be modified hence we are shallow cloning it
					tempUser = tempUser._doc;
					tempUser.token = signJWT({ _id: user._id});
					delete tempUser._id;
					delete tempUser.password;
					return res.status(200).json({status: 200, message: 'Successfully registered user ' +  req.body.email + '.', data: tempUser});
				});
			} else {
				res.status(400).json({status: 400, message: 'User ' + req.body.email + ' is already registered.'});
			}
		});
	};

	/**
	 * @api {post} /auth/login Login/authenticate a user
	 * @apiVersion 0.1.0
	 * @apiName LoginUsers
	 * @apiDescription Login and authenticate a user.
	 * @apiGroup AUTH
	 */
	exports.login = function (req, res) {
		if(req.body && !req.body.email) {
			return res.status(400).json({status: 400, message: 'Email id not provided.'});
		} else if(req.body && !req.body.password){
			return res.status(400).json({status: 400, message: 'Password not provided.'});
		}

		Users.getAuthenticated(req.body.email, req.body.password, function(err, user, errorReason) {
			if (err) {
				console.log(err); 
				return handleError(res, err); 
			} else if(errorReason) {
				return res.status(400).json({status: 400, message: errorReason});
			}

			var tempUser = Object.assign({}, user); //user object is forxez and cannot be modified hence we are shallow cloning it
			tempUser = tempUser._doc;
			tempUser.token = signJWT({ _id: user._id});
			delete tempUser._id;
			delete tempUser.password;
			return res.status(200).json({status: 200, message: 'Successfully authenticated user ' +  req.body.email + '.', data: tempUser});
			
		});
	};

	/**
     * Description : A middleware to check if the user token is valid
     * Created by : Vinay Naik on 5/7/16
     * Modified_by : Vinay Naik on 6/7/16
     *
     * @param req
     * @param res
     * @param next
     *
     * Success : Passes the control to the next middleware/route for execution.
     * Failure : Returns a 401 status code and message.
     */
    exports.isAuthenticated = function (req, res, next) {
		var token = req.body.token || req.query.token || req.headers['x-access-token'];
		if(token) {
			jwt.verify(token, config.secret, function(err, decoded) {
				if (err) {
					return res.status(401).json({status: 401,message : 'Invalid Token...'});
				} else {
					console.log("Token : ", decoded);
					req.user = {_id: decoded._id};					
					next();
				}
			});
		} else {
			return res.status(403).json({status: 403, message : 'No token provided.'});			
		}
    };
})();
