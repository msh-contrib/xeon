'use strict';

/**
 * Read file dependencies and create json output
 */
var fs = require('fs')
	, path = require('path')
	,	grapher = require('./grapher')
	, helpers = require('./helper');


// var g = new grapher.Graph();


/**
 * [Reader description]
 * @param {[type]} file [description]
 */
var Reader = module.exports = function (file) {
	if (!file) throw new Error('entry file should be defined');

	var path = helpers.normalizePath(file);

	if (!fs.existsSync(path)) return console.log('file is not exist'.red);

	// this._proto = this.constructor.prototype;
	// this._proto._readFile.call(this, path);

	// var path = grapher.resolve(g.getNode(path));
	// var concatedContent = this._proto._concatFile(path);

	// fs.writeFileSync('build.sh', concatedContent);
}

/**
 * [_parseHeader description]
 * @param  {[type]} fileContent [description]
 * @return {[type]}             [description]
 */
Reader.prototype._parseHeader = function (fileContent) {
	return (fileContent.match(/require\((".*?")\)/g) || []).map(function (header) {
		return header.replace(/require\("(.*?)"\)/g, '$1');
	});
};

/**
 * [readFile description]
 * @param  {[type]} filePath [description]
 * @return {[type]}          [description]
 */
Reader.prototype._readFile = function walk(filePath) {
	var self = this;
	var context = fs.readFileSync(filePath, 'utf-8');

	g.addNode(filePath);

	var requiredFiles = self._proto._parseHeader(context);

	if (!requiredFiles) return;

	requiredFiles.forEach(function (file) {
		var path = helpers.normalizePath(file);
		g.addEdge(filePath, path);
		walk.call(self, path);
	});
};

/**
 * [_concatFile description]
 * @param  {[type]} resolvedGraph [description]
 * @return {[type]}               [description]
 */
Reader.prototype._concatFile = function (resolvedGraph) {
	var date = new Date();
	return resolvedGraph.reduce(function (acc, current) {
		var content = fs.readFileSync(current, 'utf-8');
		return acc += '#build with shellify\n'.concat(content, '\n');
	}, '#Build at: '.concat(date, '\n'));
};

// var argv = [].slice.call(process.argv, 2);
// var reader = new Reader(argv[0]);
