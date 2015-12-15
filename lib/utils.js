'use strict';

var path = require('path');
var os = require('os');

var shebangRegex = require('shebang-regex');

/**
 * Utilities module
 * @type {Object}
 */
module.exports = {
	/**
	 * @const
	 * @type {RegExp}
	 */
	headerRegex: /require\("(.*?)"\)/g,

	/**
	 * [EOL description]
	 * @type {[type]}
	 */
	EOL: (!os.platform || os.platform() !== 'win32') ? '\n' : '\r\n' ,

	/**
	 * [replaceShebangs description]
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	replaceShebang: function (data) {
		return (shebangRegex.test(data)) ? data.replace(shebangRegex, '') : data;
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
