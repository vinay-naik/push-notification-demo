/**
 * Created by Vinay Naik on 13/11/17.
 * @author Vinay Naik
 * @fileOverview javascript file
 */

(function () {
	'use strict';

	var mongoose = require('mongoose');
	var bcrypt = require('bcrypt');
	var Schema = mongoose.Schema;

	var UsersSchema = new Schema({
		email		: { type: String, unique: true },
		password	: { type: String, select: false },
		name		: String,
		created		: Date,
		modified	: Date,
		last_online	: Date
	});

	UsersSchema.virtual('original_password')
		.set(function (original_password) {
			this._password = original_password;
			this.password = this.encryptPassword(original_password);
		})
		.get(function () {
			return this._password;
		});

		UsersSchema.methods = {

		/**
		 * Authenticate - check if the passwords are the same
		 *
		 * @param {String} plainText
		 * @return {Boolean}
		 * @api public
		 */
		authenticate: function (plainPassword) {
			return bcrypt.compareSync(plainPassword, this.password);
		},

		/**
		 * Encrypt password
		 *
		 * @param {String} password
		 * @return {String}
		 * @api public
		 */
		encryptPassword: function (password) {
			if (!password)
				return '';
			return bcrypt.hashSync(password, 10);
		}
	};

	module.exports = mongoose.model('User', UsersSchema);
})();
