#!/usr/bin/env node

'use strict';

import pkg from '../package.json';
import log from './log';
import Xeon from './xeon';
import meow from 'meow';
import notifier from './notifier';

// notify if there are some updates
notifier(pkg);

const cli = meow(`
    Usage
      $ xeon -i ./index[.sh]

    Options
      --output -o Specify output file directory
      --watch -w  Watch for changes in required files and rebuild on the fly

    version: ${pkg.version}
  `,
  {
    alias: {
      i: 'input',
      o: 'output',
      w: 'watch',
      e: 'external',
      h: 'help'
    }
  }
);

const config = {
  entry: cli.flags.input,
  output: cli.flags.output,
  allowExternal: cli.flags.external
};

((config) => {
  if (!config.entry) return console.log('Entry file should be defined');
  const xeon = new Xeon(config);

  log(xeon);

  function processBundle() {
    xeon.buildDesGraph();
    xeon.resolveDepsGraph()
    xeon.writeBundle();
  }

  processBundle();

  if (cli.flags.watch) {
    xeon.watchDeps((file) => {
      processBundle();
    });
  }
})(config)
