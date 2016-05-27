var http = require('http');
var path = require('path');
var Graph = require('graphine');
var urlRegex = require('url-regex');
var trim = require('trim');
var _headerRegExp = /require\("(.*?)"\)/g;

function loadSourceFile(fileAccess) {
  if (urlRegex({ exact: true }).test(fileAccess)) {
      http.get(fileAccess, function (response) {
        return response;
      }).on('error', function (error) {
        process.stdout.write('Error while loading file: ' + JSON.stringify(error));
      });
  }
}

/**
 * read source file and build dependency graph, recursively
 * @param {String} file - file path
 * @return {Graph} dependencies graph
 */
module.exports = function (file) {
  var self = this;
  var graph = new Graph();

  (function walk(file, parent) {
    // if graph already have such node skip
    if (graph.getNode(file)) return;
    var node = graph.getNode(file);
    var data = (urlRegex({ exact: true }).test(file)) ? fileUtils.load(file) : fileUtils.readFile(file);

    // add node if nece
    graph.addNode(file, {
      content: trim(data.replace(_headerRegExp, ''))
    });

    // get required modules
    var required = fileUtils.parseHeader(data);

    // if parent exist add edge from it to child
    if (parent) graph.addEdge(parent, file);
    // if no modules required break recusion
    if (!required.length) return;

    required.forEach(function (path) {
      walk(path, file);
    });
  })(file);
  return graph;
};
