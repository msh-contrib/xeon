/**
 * Build single file from resolved path
 */
var fs = require('fs'),
  , helpers = require('./helpers');

/**
 * [Builder description]
 * @param {[type]} files     [description]
 * @param {[type]} outputLoc [description]
 * @param {[type]} opts      [description]
 */
function Builder(files, outputLoc, opts) {
	opts = opts || {};
	this.files = files || [];
	this.outputLoc = outputLoc || process.cwd();
}

/**
 * [concatFiles description]
 * @return {[type]} [description]
 */
Builder.prototype.concatFiles = function () {
	return resolvedGraph.reduce(function (acc, current) {
		var content = fs.readFileSync(current, 'utf-8');
		return acc += '\n'.concat(content, '\n');
	}, '#!/bin/bash');
};

/**
 * [genOutput description]
 * @param  {[type]} fileName [description]
 * @param  {[type]} content  [description]
 * @return {[type]}          [description]
 */
Builder.prototype.genOutput = function (fileName, content) {
	if (typeof fileName !== 'string') return;
	fileName = fileName || 'bundle.sh';
	var loc = this.outputLoc.concat(fileName);
	fs.writeFileSync(loc, concatedContent);
};

module.exports = Builder;
