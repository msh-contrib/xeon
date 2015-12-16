#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');

var meow = require('meow');
var pkg = require('../package.json');
var file = require('./file');
var utils = require('./utils');
var Queue = require('./queue');

var cli = meow({
  help: [
    'Usage',
    '  $ br ./{dir}/{script_name}[.sh]',
    '',
    'Options',
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
  var entry = cli.input[0];

  if (!entry) {
    console.log('Entry Should be defined');
    return;
  }

  var normalizedPath = utils.normalizePath(entry);
  var deps = file.buildDepsGraph(normalizedPath);
  var resolved_deps = file.resolveGraph(deps.getNode(normalizedPath));
  var list = file.getData(resolved_deps);
  var build = file.mergeData(list);
  file.write(cli.flags.output, build);

  if (cli.flags.watch) {
    file.watch(file.getPathes(resolved_deps), function (path) {
      console.log('[br]: Rebuilding bundle on change...');

      var deps = file.buildDepsGraph(normalizedPath);
      var resolved_deps = file.resolveGraph(deps.getNode(normalizedPath));
      var list = file.getData(resolved_deps);
      var build = file.mergeData(list);
      file.write(cli.flags.output, build);
    });
  }
}

initialize();
