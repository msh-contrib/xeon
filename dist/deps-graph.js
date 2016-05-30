'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _trim = require('trim');

var _trim2 = _interopRequireDefault(_trim);

var _graph = require('./graph');

var _graph2 = _interopRequireDefault(_graph);

var _urlRegex = require('url-regex');

var _urlRegex2 = _interopRequireDefault(_urlRegex);

var _utils = require('./utils');

var _syncRequest = require('sync-request');

var _syncRequest2 = _interopRequireDefault(_syncRequest);

var _file = require('./file');

var file = _interopRequireWildcard(_file);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// check if string is relative path
function relativePath(file) {
  return (0, _utils.beginsWith)(file, './') || (0, _utils.beginsWith)(file, '../');
}

// read deps file and get data
function readDepsFile(moduleLoc) {
  var pkg = _path2.default.join(moduleLoc, './package.json');
  if (!_fs2.default.statSync(pkg).isFile()) throw new Error('can not find package.json file');
  return JSON.parse(file.readFile(pkg));
}

// get main file from package json
function getMainFile(pkgFile) {
  if (!pkgFile) throw new Error('deps file should be defined');
  return pkgFile.main || './index.sh';
}

// find module location
function makeModuleLookup(moduleName) {
  var nodeModulesPath = _path2.default.join(process.cwd(), 'node_modules', moduleName);
  if (_fs2.default.statSync(nodeModulesPath).isDirectory()) {
    return nodeModulesPath;
  } else {
    throw new Error('Could not find ' + modulePath);
  }
}

// return resolved string for file path
function resolveFilePath(file, parent) {
  if (!file || typeof file !== 'string') throw new Error('file should be a string');

  if (relativePath(file) && parent) {
    return _path2.default.resolve(_path2.default.dirname(parent), file);
  }

  if (relativePath(file) && !parent) {
    return _path2.default.resolve(process.cwd(), file);
  }

  if (_path2.default.isAbsolute(file)) return file;

  var modulePath = makeModuleLookup(file);
  if (!modulePath) throw new Error('Can not find modules location');

  var pkgFile = readDepsFile(modulePath);
  var mainFile = getMainFile(pkgFile);

  return _path2.default.resolve(modulePath, mainFile);
}

exports.default = function (filePath, allowExternal) {
  var graph = new _graph2.default();

  (function walk(filePath, parent) {
    // if graph already have such node skip
    if (graph.getNode(filePath)) return;

    var data = null,
        normalizedPath = null;

    if ((0, _urlRegex2.default)({ exact: true }).test(filePath)) {
      if (!allowExternal) throw new Error('external files not allowed');
      try {
        var response = (0, _syncRequest2.default)('GET', filePath);
        if (response.statusCode !== 200) throw new Error('Error while loading file, code ' + response.statusCode);
        data = response.getBody('utf8');
      } catch (error) {
        throw new Error('Error while loading file ' + filePath);
      }
    } else {
      normalizedPath = resolveFilePath(filePath, parent);
      data = file.readFile(normalizedPath);
    }

    // add node if nece
    graph.addNode(normalizedPath || filePath, {
      content: (0, _trim2.default)(data.replace(_utils.headerRegex, ''))
    });

    // get required modules
    var required = file.parseHeader(data);

    // if parent exist add edge from it to child
    if (parent) graph.addEdge(parent, normalizedPath || filePath);
    // if no modules required break recusion
    if (!required.length) return;

    required.forEach(function (path) {
      walk(path, normalizedPath);
    });
  })(filePath);

  return graph;
};