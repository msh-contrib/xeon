'use strict';

var path = require('path');
var os = require('os');

var shebangRegex = require('shebang-regex');
var utils = module.exports = {};

//regex for matching source headers
utils.headerRegex = /require\("(.*?)"\)/g;

//end of line
utils.EOL = (!os.platform || os.platform() !== 'win32') ? '\n' : '\r\n';

//replace shebang
utils.replaceShebang = function (data) {
	return data.replace(shebangRegex, '');
};

/**
 * @param  {String} filePath
 * @return {String} normalized path
 */
utils.normalizePath = function (filePath) {
	return (path.isAbsolute(filePath)) ? filePath : path.join(process.cwd(), filePath);
};

utils.toCorrectString = function (obj) {
	return ({}).toString.call(obj);
};

/**
 * check if value is object
 * @param  {?}  value
 * @return {Boolean}
 */
utils.isObject = function (value) {
	return ( (typeof value === 'object') && (this.toCorrectString(value) === '[object Object]') );
};

utils.hasProperty = function (obj, prop) {
	return ({}).hasOwnProperty.call(obj, prop);
};
