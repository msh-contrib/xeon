'use strict';

var chalk = require('chalk');

module.exports = {

	/**
	 * Error logging message
	 * @param  {String} mesage
	 * @return
	 */
	error: function (message) {

	},

	/**
	 * Success logging message
	 * @param  {String} message
	 * @return
	 */
	success: function (message) {

	},

	/**
	 * General message logging
	 * @param  {String} message
	 * @return
	 */
	log: function (message) {
		//simple for now
		console.log(message);
	}
	
};
