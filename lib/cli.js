#!/usr/bin/env node
'use strict';
var fs = require('fs');
var path = require('path');

var meow = require('meow');
var chalk = require('chalk');
var pkg = require('../package.json');
var file = require('./file');
var utils = require('./utils');

var cli = meow({
  help: [
    'Usage',
    '  $ br ./test[.sh]',
    '',
    'Options',
    '  --output  Specify output file directory',
    '  --watch   Watch for changes in required files and rebuild on the fly',
    '',
    'version: ' + pkg.version
  ]
});

var entry = cli.flags.input;
var outdir = cli.flags.output || path.join(process.cwd(), './bundle.sh');

if (!entry) {
  console.log(chalk.white(
    chalk.cyan('[br]'),
    chalk.red('[Error]'),
    'entry file should be defined'
  ));
  return;
}

var resolved_deps = processPath(entry);

if (cli.flags.watch) {
  file.watch(file.getPathes(resolved_deps), function (path) {
    console.log(
      chalk.white(
        chalk.cyan('[br]'),
        'changes detected in file',
        chalk.underline.bgGreen('%s')
      ),
      path
    );
    processPath(entry);
  });
}

function processPath(path) {
  var deps = file.buildDepsGraph(path);
  var resolved_deps = file.resolveGraph(deps.getNode(path));
  var list = file.getData(resolved_deps);
  var build = file.mergeData(list);
  file.write(outdir, build);
  return resolved_deps;
}
