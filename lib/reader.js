/**
 * Read file dependencies and create json output
 */
var fs = require('fs')
	, path = require('path')
	,	grapher = require('./grapher')
	, Queue = require('./queue')
	, colors = require('colors');


var g = new grapher.Graph();

/**
 * [normalizePath description]
 * @param  {[type]} file [description]
 * @return {[type]}      [description]
 */
function normalizePath(file) {
	return (path.isAbsolute(file)) ? file : path.join(process.cwd(), file);
}

/**
 * [Reader description]
 * @param {[type]} file [description]
 */
function Reader(file) {
	if (!file) throw new Error('entry file should be defined');

	var path = normalizePath(file);
	var queue = new Queue();
	this.fileCache = [];

	if (!fs.existsSync(path)) return console.log('file is not exist'.red);

	this._proto = this.constructor.prototype;
	var resolved = this._proto._readFile.call(this, path);
	console.log(this._proto._concatFile(resolved));
}

Reader.prototype._parseHeader = function (fileContent) {
	return fileContent.match(/require\((".*?")\)/g).map(function (header) {
		return header.replace(/require\("(.*?)"\)/g, '$1');
	});
};

/**
 * [readFile description]
 * @param  {[type]} filePath [description]
 * @return {[type]}          [description]
 */
Reader.prototype._readFile = function (filePath) {
	var self = this;
	var context = fs.readFileSync(filePath, 'utf-8');

	self.fileCache.push({
		id: filePath,
		source: context
	});

	var requiredFiles = this._proto._parseHeader(context);
	requiredFiles.forEach(function (file) {
		g.addEdge(filePath, normalizePath(file));
	});

	return grapher.resolve(g.getNode(filePath));
};

Reader.prototype._concatFile = function (resolvedGraph) {
	return resolvedGraph.reduce(function (acc, current) {
		console.log(current);
		var content = fs.readFileSync(current.id, 'utf-8');
		return acc += content.concat('\n');
	}, '');
}

var argv = [].slice.call(process.argv, 2);
var reader = new Reader(argv[0]);
