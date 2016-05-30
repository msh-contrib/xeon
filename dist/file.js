'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readFile = readFile;
exports.mergeData = mergeData;
exports.parseHeader = parseHeader;
exports.getPathes = getPathes;
exports.getData = getData;

var _fs = require('fs');

var _utils = require('./utils');

function readFile(file) {
  if (!(0, _fs.statSync)(file).isFile()) throw new Error('file: ' + file + ' could not be found');
  try {
    return (0, _fs.readFileSync)(file, 'utf-8');
  } catch (error) {
    throw new Error('Error while reading file ' + file);
  }
}

function mergeData(data) {
  if (!Array.isArray(data)) throw TypeError('data: ' + data + ' should be a string');
  var shebang = _utils.correctShebang.concat(_utils.EOL);
  return data.reduce(function (acc, curr) {
    return acc.concat((0, _utils.replaceShebang)(curr).concat(_utils.EOL));
  }, shebang);
}

function parseHeader(data) {
  if (!data || typeof data !== 'string') throw new Error('data: ' + data + ' should be a string');
  return (data.match(_utils.headerRegex) || []).map(function (header) {
    return header.replace(_utils.headerRegex, '$1');
  });
}

function getPathes(resolvedGraph) {
  if (!resolvedGraph) throw Error('resolvedGraph should be defined');
  return resolvedGraph.map(function (item) {
    return item.id;
  });
}

function getData(resolvedGraph) {
  if (!resolvedGraph) throw new Error('resolved graph should be defined');
  return resolvedGraph.map(function (item) {
    return item.params.content;
  });
}