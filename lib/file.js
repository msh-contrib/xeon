'use strict';

/**
 * Read file dependencies and create json output
 */
var fs = require('fs');
var path = require('path');

var grapher = require('./grapher');
var utils = require('./utils');
var logger = require('./logger');

var file = module.exports = {};

/**
 * [readFileContent description]
 * @param  {[type]} file [description]
 * @return {[type]}      [description]
 */
file.readFileContent = function (file) {
	var data;
	if (!this.isFile(file)) return;
	
	try {
		data = fs.readFileSync(file, 'utf-8');
	} catch (e) {
		logger.log(e);
	}

	return data;
};

/**
 * [processFileDeps description]
 * @return {[type]} [description]
 */
file.buildDepsGraph = function (file) {
	var self = this;
	var graph = new grapher.Graph();

	(function walk(file, parent) {
		var data = self.readFileContent(file);
		var required = self.parseHeader(data);

		graph.addNode(file, {
			content: data
		});

		if (parent) {
			graph.addEdge(parent, file);
		}

		if (!required.length) return;

		required.forEach(function (path) {
			var normalized = utils.normalizePath(path);
			walk(normalized, file);
		});

	})(file);

	return graph;
};

/**
 * [resolveGraph description]
 * @param  {[type]} graph [description]
 * @return {[type]}       [description]
 */
file.resolveGraph = function (graph) {
	if (!graph) throw Error('graph should be defined');
	return grapher.resolve(graph);
};

/**
 * [cleanResolvedPath description]
 * @param  {[type]} resolvedGraph [description]
 * @return {[type]}               [description]
 */
file.getDataList = function (resolvedGraph) {
	if (!resolvedGraph) throw Error('resolvedGraph should be defined');

	return resolvedGraph.map(function (item) {	
		return item.params.content;
	});
};

/**
 * [isFile description]
 * @param  {[type]}  file [description]
 * @return {Boolean}      [description]
 */
file.isFile = function (path) {
	return fs.statSync(path).isFile();
};

/**
 * [isDir description]
 * @param  {[type]}  path [description]
 * @return {Boolean}      [description]
 */
file.isDir = function (path) {
	return fs.statSync(path).isDir();
};

/**
 * [parseHeader description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
file.parseHeader = function (data) {
	return (data.match(utils.headerRegex) || []).map(function (header) {
		return header.replace(utils.headerRegex, '$1');
	});
};

/**
 * [concatFiles description]
 * @param  {[type]} files [description]
 * @return {[type]}       [description]
 */
file.mergeData = function (dataList) {
	if (!Array.isArray(dataList)) throw TypeError('Should be a list');
	var shebang = '#!/usr/bin/env bash'.concat(utils.EOL);

	return dataList.reduce(function (acc, curr) {
		var cleaned = utils.replaceShebang(curr).concat(utils.EOL);
		return acc.concat(cleaned);
	}, shebang);
};

/**
 * [writeFile description]
 * @param  {[type]} fileName [description]
 * @param  {[type]} dir      [description]
 * @param  {[type]} content  [description]
 * @return {[type]}          [description]
 */
file.writeFile = function (path, content) {
	try {
		fs.writeFileSync(path, content, 'utf-8');
	} catch (e) {
		logger.log(e);
	}

	logger.log('File was written');
};
