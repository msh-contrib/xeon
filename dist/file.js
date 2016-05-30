'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _utils = require('./utils');

exports.default = {
  readFile: function readFile(file) {
    if (!(0, _fs.statSync)(file).isFile()) throw new Error('file: ' + file + ' could not be found');
    try {
      return fs.readFileSync(file, 'utf-8');
    } catch (error) {
      throw new Error('Error while reading file ' + file);
    }
  },
  mergeData: function mergeData(data) {
    if (!Array.isArray(data)) throw TypeError('data: ' + data + ' should be a string');
    var shebang = _utils.correctShebang.concat(_utils.EOL);
    return data.reduce(function (acc, curr) {
      return acc.concat((0, _utils.replaceShebang)(curr).concat(_utils.EOL));
    }, shebang);
  },
  parseHeader: function parseHeader(data) {
    if (!data || typeof data !== 'string') throw new Error('data: ' + data + ' should be a string');
    return (data.match(_utils.headerRegex) || []).map(function (header) {
      return header.replace(_utils.headerRegex, '$1');
    });
  },
  getPathes: function getPathes(resolvedGraph) {
    if (!resolvedGraph) throw Error('resolvedGraph should be defined');
    return resolvedGraph.map(function (item) {
      return item.id;
    });
  },
  getData: function getData(resolvedGraph) {
    if (!resolvedGraph) throw Error('resolvedGraph should be defined');
    return resolvedGraph.map(function (item) {
      return item.params.content;
    });
  }
};