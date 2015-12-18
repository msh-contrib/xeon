#!/usr/bin/env node
"use strict";
const fs = require('fs');
const path = require('path');

const meow = require('meow');
const chalk = require('chalk');
const pkg = require('../package.json');
const file = require('./file');
const utils = require('./utils');

const cli = meow({
  help: [
    'Usage',
    '  $ br ./test[.sh]',
    '',
    'Options',
    '  --output  Specify output file directory',
    '  --watch   Watch for changes in required files and rebuild on the fly',
    '',
    `version: ${pkg.version}`
  ]
});

const entry = cli.flags.input;
const outdir = cli.flags.output || path.join(process.cwd(), './bundle.sh');

if (!entry) {
  console.log(chalk.white(
    chalk.cyan('[br]'),
    chalk.red('[Error]'),
    'entry file should be defined'
  ));
  return;
}

const resolved_deps = processPath(entry);

if (cli.flags.watch) {
  file.watch(file.getPathes(resolved_deps), path => {
    console.log(chalk.white(
      chalk.cyan('[br]'),
      'changes detected in file',
      chalk.underline.bgGreen('%s')
    ), path);
    processPath(normalizedPath);
  });
}

function processPath(path) {
  const deps = file.buildDepsGraph(path);
  const resolved_deps = file.resolveGraph(deps.getNode(path));
  const list = file.getData(resolved_deps);
  const build = file.mergeData(list);
  file.write(outdir, build);
  return resolved_deps;
}