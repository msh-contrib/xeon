'use strict';

/**
 * Read file dependencies and create json output
 */
var fs = require('fs')
	, path = require('path')
	,	Graph = require('./grapher').Graph
	, resolve = require('./grapher').resolve
	, utils = require('./utils');

var file = module.exports = {};
file.depsGraph = new Graph();

file.readFile = function walk(filePath, parentNode) {
	filePath = utils.normalizePath(filePath);
	var self = this;
	var data = fs.readFileSync(filePath, 'utf-8');
	var required = self.parseHeader(data);

	self.depsGraph.addNode(filePath, {
		content: data
	});

	if (parentNode) {
		self.depsGraph.addEdge(parentNode, filePath);
	}

	if (!required.length) return;

	required.forEach(function (reqFilePath) {
		reqFilePath = utils.normalizePath(reqFilePath);
		walk.call(self, reqFilePath, filePath);
	});
};

file.parseHeader = function (data) {
	return (data.match(/require\((".*?")\)/g) || []).map(function (header) {
		return header.replace(/require\("(.*?)"\)/g, '$1');
	});
};

file.concatFiles = function () {

};

file.writeBundle = function () {

};

file.readFile('./test/test.sh');

console.log(depsGraph);
