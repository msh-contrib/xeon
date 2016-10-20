'use strict';

const platform = require('os').platform
const path = require('path')
const shebangRegex = require('shebang-regex')

/**
 * Aliases
 */
const isAbsolute = path.isAbsolute
const resolve = path.resolve

var utils = {}

utils.headerRegex = /require\("(.*?)"\)/g
utils.EOL = (!platform || platform() !== 'win32') ? '\n' : '\r\n'

utils.correctShebang = '#!/usr/bin/env bash'

//replace shebang
utils.replaceShebang = function (data) {
  return data.replace(shebangRegex, '')
}

utils.toCorrectString  = function (obj) {
  return ({}).toString.call(obj)
}

utils.isObject = function (value) {
  return ( (typeof value === 'object') && (toCorrectString(value) === '[object Object]') )
}

utils.hasProperty = function (obj, prop) {
  return ({}).hasOwnProperty.call(obj, prop)
}

utils.beginsWith = function (target, str) {
  return target.slice(0, str.length) === str
}

utils.resolvePath = function (file) {
  return isAbsolute(file) ? file : resolve(process.cwd(), file)
}

module.exports = utils
