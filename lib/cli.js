#!/usr/bin/env node
'use strict';

import {version} from './package.json';
import log from './log';
import Xeon from './xeon';

const cli = meow(`
    Usage
      $ br ./test[.sh]

    Options
      --output  Specify output file directory
      --watch   Watch for changes in required files and rebuild on the fly

    version: ${version}
  `,
  {
    alias: {
      i: 'input',
      o: 'output',
      watch: 'watch'
    }
  }
);

const config = {
  entry: cli.flags.input,
  output: cli.flags.output,
  watch: cli.flags.watch
};


((config) => {
  if (!config.entry) return console.log('Entry file should be defined');
  const xeon = new Xeon(config.entry, config.output);

  log(xeon);

  function processBundle() {
    xeon.buildDepsGraph();
    xeon.resolveDepGraph();
    xeon.writeBundle();
  }

  processBundle();

  if (config.watch) {
    console.log('start watching...');
  }
})(config)
