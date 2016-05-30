'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _urlRegex = require('url-regex');

var urlRegex = _interopRequireWildcard(_urlRegex);

var _trim = require('trim');

var trim = _interopRequireWildcard(_trim);

var _graph = require('./graph');

var _graph2 = _interopRequireDefault(_graph);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _file = require('./file');

var _file2 = _interopRequireDefault(_file);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// check if string is relative path
function relativePath(file) {
  return _utils2.default.beginsWith(file, './') || _utils2.default.beginsWith(file, '../');
}

// read deps file and get data
function readDepsFile(moduleLoc) {
  var pkg = path.join(moduleLoc, 'package.json');
  if (!fs.statSync(pkg).isFile()) throw new Error('can not find package.json file');
  return JSON.parse(fileUtils.readFile(pkg));
}

// get main file from package json
function getMainFile(pkgFile) {
  if (!pkgFile) throw new Error('deps file should be defined');
  return pkgFile.main || 'index.sh';
}

// find module location
function makeModuleLookup(moduleName) {
  // just for now
  return path.join(process.cwd(), 'node_modules', moduleName);
}

// return resolved string for file path
function resolveFilePath(file, parent) {
  if (!file || typeof file !== 'string') throw new Error('file should be a string');

  if (relativePath(file) && parent) {
    return path.resolve(path.dirname(parent), file);
  }

  if (relativePath(file) && !parent) {
    return path.resolve(process.cwd(), file);
  }

  if (path.isAbsolute(file)) return file;

  var modulePath = makeModuleLookup(file);
  if (!modulePath) throw new Error('Can not find modules location');

  var pkgFile = readDepsFile(modulePath);
  var mainFile = getMainFile(pkgFile);

  return path.resolve(modulePath, mainFile);
}

exports.default = function (file) {
  var graph = new _graph2.default();

  (function walk(file, parent) {
    // if graph already have such node skip
    if (graph.getNode(file)) return;

    var normalizedPath = resolveFilePath(file, parent);
    var data = fileUtils.readFile(normalizedPath);

    // add node if nece
    graph.addNode(normalizedPath, {
      content: trim(data.replace(_headerRegExp, ''))
    });

    // get required modules
    var required = fileUtils.parseHeader(data);

    // if parent exist add edge from it to child
    if (parent) graph.addEdge(parent, normalizedPath);
    // if no modules required break recusion
    if (!required.length) return;

    required.forEach(function (path) {
      walk(path, normalizedPath);
    });
  })(file);

  return graph;
};