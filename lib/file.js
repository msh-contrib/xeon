'use strict';
var fs = require('fs');
var path = require('path');

var chokidar = require('chokidar');
var mkdirp = require('mkdirp');
var trim = require('trim');
var chalk = require('chalk');
var request = require('sync-request');
var urlRegex = require('url-regex');
var Graph = require('./graph').Graph;
var resolve = require('./graph').resolve;
var utils = require('./utils');

var file = module.exports = {};

/**
 * read file content
 * @param  {String} file - file path
 * @return null
 */
file.readFile = function (file) {
  console.log(
    chalk.white(
      chalk.cyan('[br]'),
      'reading data from',
      chalk.magenta(file)
    )
  )
  if (!this.isFile(file)) return; 
  try {
    return fs.readFileSync(file, 'utf-8');
  } catch (error) {
    console.log(
      chalk.red('Cound not read file: %s'), 
      error
    );
  }
};

/**
 * read source file and build dependency graph, recursively
 * @param {String} file - file path
 * @return {Graph} dependencies graph
 */
file.buildDepsGraph = function (file) {
  console.log(
    chalk.white(
      chalk.cyan('[br]'),
      'build dependency graph for',
      chalk.magenta(file)
    )
  )

  file = utils.normalizePath(file);
  var self = this;
  var graph = new Graph();

  (function walk(file, parent) {
    var data = (urlRegex({ exact: true }).test(file)) ? self.load(file) : self.readFile(file);
    var required = self.parseHeader(data);
    graph.addNode(file, {
      content: trim(data.replace(utils.headerRegex, ''))
    });
    if (parent) {
      graph.addEdge(parent, file);
    }
    if (!required.length) return;
    required.forEach(function (path) {
      walk(path, file);
    });
  })(file);


  console.log('graph finished');
  return graph;
};

/**
 * resolve dependencies graph
 * @param  {Graph} graph
 * @return {Array} resolved path
 */
file.resolveGraph = function (graph) {
  if (!graph) throw Error('graph should be defined');
  return resolve(graph);
};

/**
 * [load description]
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
file.load = function (url) {
  console.log(
    chalk.white(
      chalk.cyan('[br]'),
      'loading file from',
      chalk.magenta(url)
    )
  )
  try {
    var res = request('GET', url).getBody('utf-8');
  } catch (error) {
    console.log(chalk.red(error))
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
  var shebang = '#!/usr/bin/env bash'.concat(utils.EOL);
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
    console.log(
      chalk.red('Could not write file: %s'), 
      error
    );
  }
  console.log(
    chalk.white(
      chalk.cyan('[br]'), 
      'file', 
      chalk.bold.bgGreen('%s'),
      'was written',
      'at',
      chalk.bold.magenta('%s')
    ), 
    opt.base,
    opt.dir
  )
};

/**
 * watch file changes and pefrom action
 * on specific event
 * @param  {Array} files - list of files to watch
 */
file.watch = function (args, cb) {
  var watcher = chokidar.watch(args, { ignoreInitial: true });
  watcher.on('ready', function () {
    console.log(
      chalk.white(
        chalk.cyan('[br]'),
        'start watching files...'
      ),
      chalk.gray('\n * press Ctrl+C to leave watch mode')
    );
  });
  watcher.on('change', cb);
};
