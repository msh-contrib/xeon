#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');

var chalk = require('chalk');
var meow = require('meow');
var pkg = require('../package.json');
var file = require('./file');
var utils = require('./utils');
var Queue = require('./queue');

var cli = meow({
  help: [
    'Usage',
    '  $ borscht',
    '',
    'Options',
    '  --run     Run script after building bundle',
    '  --output  Specify output file directory',
    '  --watch   Watch for changes in required files and rebuild on the fly',
    '',
    'version: ' + pkg.version
  ]
});

/**
 * [initialize description]
 * @return {[type]} [description]
 */
function initialize() {
  if (cli.flags.run) {
    console.log('exec script');
  }

  if (!cli.input.length) return;

  var q = new Queue();

  cli.input.forEach(function (item) {
    q.enqueue(item);
  });

  while(!q.isEmpty()) {
    processEntry(q.dequeue());
  }
  console.log('q processed');
}

function processEntry(entry) {
  console.log('run');
  var normalizedPath = utils.normalizePath(entry);
  var deps = file.buildDepsGraph(normalizedPath);
  var resolved_deps = file.resolveGraph(deps.getNode(normalizedPath));
  var list = file.getDataList(resolved_deps);

  var build = file.mergeData(list);

  file.writeFile('./bundler.sh', build);
}

initialize();
