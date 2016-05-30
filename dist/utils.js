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

var _os = require('os');

var _shebangRegex = require('shebang-regex');

var shebangRegex = _interopRequireWildcard(_shebangRegex);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//regex for matching source headers
var headerRegex = exports.headerRegex = /require\("(.*?)"\)/g;

//end of line
var EOL = exports.EOL = !_os.platform || (0, _os.platform)() !== 'win32' ? '\n' : '\r\n';

var correctShebang = exports.correctShebang = '#!/usr/bin/env bash';

//replace shebang
function replaceShebang(data) {
  return data.replace(shebangRegex, '');
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