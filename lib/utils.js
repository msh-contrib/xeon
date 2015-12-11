'use strict';

var path = require('path');

/**
 * Utilities module
 * @type {Object}
 */
module.exports = {
	/**
	 * Generate header regex
	 * @return {String}
	 */
	genHeaderRegex: function (keyword) {
		if (typeof keyword !== 'string') return;
		return new RegExp('/' + keyword + '\((".*?")\)/', 'g', 'i');
	},

	/**
	 * @param  {String} filePath
	 * @return {String} normalized path
	 */
	normalizePath: function (filePath) {
		return (path.isAbsolute(filePath)) ? filePath : path.join(process.cwd(), filePath);
	},

	/**
	 * Be sure that u use correct Object.toString method
	 * @param  {Object} obj
	 * @return {String}
	 */
	toCorrectString: function (obj) {
		return ({}).toString.call(obj);
	},

	/**
	 * Check if value is an object
	 * @param  {?}  value
	 * @return {Boolean}
	 */
	isObject: function (value) {
		return ( (typeof value === 'object') && (this.toCorrectString(value) === '[object Object]') );
	},

	/**
	 * Check if object has a specific property
	 * @param  {Object}  obj
	 * @param  {String}  prop - key
	 * @return {Boolean}
	 */
	hasProperty: function (obj, prop) {
		return ({}).hasOwnProperty.call(obj, prop);
	}

};
