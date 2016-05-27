'use strict';
var fs = require('fs');
var path = require('path');

var mkdirp = require('mkdirp');
var trim = require('trim');
var chalk = require('chalk');
var request = require('sync-request');
var urlRegex = require('url-regex');
var Graph = require('./graph');
var resolver = require('./resolver');
var utils = require('./utils');
var emitter = new require('events').EventEmitter;

var file = module.exports = {};

/**
 * read file content
 * @param  {String} file - file path
 * @return null
 */
file.readFile = function (file) {
  console.log(chalk.white(
    chalk.cyan('[br]'),
    'reading data from',
    chalk.magenta(file)
  ));
  if (!this.isFile(file)) return;
  try {
    return fs.readFileSync(file, 'utf-8');
  } catch (error) {
    console.log(error);
  }
};

/**
 * resolve dependencies graph
 * @param  {Graph} graph
 * @return {Array} resolved path
 */
file.resolveGraph = function (graph) {
  if (!graph) throw Error('graph should be defined');
  return resolver(graph);
};

// load external file content sync
file.load = function (url) {
  console.log(chalk.white(
    chalk.cyan('[br]'),
    'loading file from',
    chalk.magenta(url)
  ));

  try {
    var res = request('GET', url).getBody('utf-8');
  } catch (error) {
    console.log(error);
  }
  return res;
};

/**
 * get content list from resolved graph
 * @param  {Graph} resolvedGraph
 * @return {Array}
 */
file.getData = function (resolvedGraph) {
  if (!resolvedGraph) throw Error('resolvedGraph should be defined');

  return resolvedGraph.map(function (item) {
    return item.params.content;
  });
};

/**
 * get path list from resolved graph
 * @param  {Graph} resolvedGraph
 * @return {Array}
 */
file.getPathes = function (resolvedGraph) {
  if (!resolvedGraph) throw Error('resolvedGraph should be defined');

  return resolvedGraph.map(function (item) {
    return item.id;
  });
};

/**
 * check if path is file path
 * @param  {String}  file
 * @return {Boolean}
 */
file.isFile = function (path) {
  return fs.statSync(path).isFile();
};

/**
 * check if path is directory path
 * @param  {String}  path
 * @return {Boolean}
 */
file.isDir = function (path) {
  return fs.statSync(path).isDirectory();
};

/**
 * parse headers, return list of required pathes
 * @param  {String} data - file content
 * @return {Array} list of pathes to be included
 */
file.parseHeader = function (data) {
  return (data.match(utils.headerRegex) || []).map(function (header) {
    return header.replace(utils.headerRegex, '$1');
  });
};

/**
 * merge content data,
 * replace shebang in file if needed,
 * add general shebang
 * @param  {Array} data - list of content strings
 * @return {String} merged string
 */
file.mergeData = function (data) {
  if (!Array.isArray(data)) throw TypeError('Should be a list');
  var shebang = utils.correctShebang.concat(utils.EOL);
  return data.reduce(function (acc, curr) {
    return acc.concat( utils.replaceShebang(curr).concat(utils.EOL) );
  }, shebang);
};

/**
 * write new file,
 * create dir and sub-dirs if needed
 * @param  {String} xpath
 * @param  {String} content - file content
 */
file.write = function (xpath, content) {
  var opt = path.parse(xpath);
  mkdirp.sync(opt.dir);
  try {
    fs.writeFileSync(xpath, content, 'utf-8');
  } catch (error) {
    console.log('Cound not find file : e ', error)
  }
  console.log(chalk.white(
    chalk.cyan('[br]'),
    'file',
    chalk.bold.bgGreen(opt.base),
    'was written at',
    chalk.bold.magenta(opt.dir)
  ));
};
