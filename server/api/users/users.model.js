/**
 * Created by Vinay Naik on 13/11/17.
 * @author Vinay Naik
 * @fileOverview javascript file
 */
(function () {
	'use strict';

	var mongoose= require('mongoose');
	var bcrypt 	= require('bcrypt');
	var moment 	= require('moment');
	// var config 	= require('../../config/');
	var Schema 	= mongoose.Schema;
	var SALT_WORK_FACTOR = 10;
	

	var UsersSchema = new Schema({
		email		: { type: String, unique: true, index: true },
		password	: { type: String, select: false },
		name		: String,
		created		: Date,
		modified	: Date,
		last_online	: Date
	});

	UsersSchema.pre('save', function(next) {
		var user = this;
		// only hash the password if it has been modified (or is new)
		if (!user.isModified('password')) return next();
	
		// generate a salt. We can also store a salt in config and use that.
		bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
			if (err) return next(err);
	
			// hash the password using our new salt. 
			bcrypt.hash(user.password, salt, function(err, hash) {
				if (err) return next(err);
				user.password = hash;
				next();
			});
		});
	});

	UsersSchema.statics.getAuthenticated = function(email, password, next) {
		this.findOne({ email: email }).select('+password').exec(function(err, user) {
			if (err) {
				return next(err);
			}

			// make sure the user exists
			if (!user) {
				return next(null, null, "Invalid email. User not found.");
			}
			
			// test for a matching password
			user.comparePassword(password, function(err, isMatch) {
				if (err) {
					return next(err);
				}
				// check if the password was a match
				if(isMatch) {
					var currentTime = moment().format();
					var updates = {
						$set: { last_online: currentTime},
					};
					user.update(updates, function(err) {
						if(err) return next(err);
						return next(null, user);
					});
				} else {
					return next(null, null, "Incorrect password. Please try again.");
				}
			});
		});
	};
	
	
	UsersSchema.methods.comparePassword = function(candidatePassword, next) {
		bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
			if (err) return next(err);
			return next(null, isMatch);
		});
	};
	
	module.exports = mongoose.model('User', UsersSchema);
})();
