'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.correctShebang = exports.EOL = exports.headerRegex = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.replaceShebang = replaceShebang;
exports.toCorrectString = toCorrectString;
exports.isObject = isObject;
exports.hasProperty = hasProperty;
exports.beginsWith = beginsWith;
exports.resolvePath = resolvePath;

var _os = require('os');

var _path = require('path');

var _shebangRegex = require('shebang-regex');

var _shebangRegex2 = _interopRequireDefault(_shebangRegex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//regex for matching source headers
var headerRegex = exports.headerRegex = /require\("(.*?)"\)/g;

//end of line
var EOL = exports.EOL = !_os.platform || (0, _os.platform)() !== 'win32' ? '\n' : '\r\n';

var correctShebang = exports.correctShebang = '#!/usr/bin/env bash';

//replace shebang
function replaceShebang(data) {
  return data.replace(_shebangRegex2.default, '');
};

function toCorrectString(obj) {
  return {}.toString.call(obj);
};

function isObject(value) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && toCorrectString(value) === '[object Object]';
};

function hasProperty(obj, prop) {
  return {}.hasOwnProperty.call(obj, prop);
};

function beginsWith(target, str) {
  return target.slice(0, str.length) === str;
};

function resolvePath(file) {
  return (0, _path.isAbsolute)(file) ? file : (0, _path.resolve)(process.cwd(), file);
}