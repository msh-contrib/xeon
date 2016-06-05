#!/usr/bin/env node

'use strict';

import path from 'path';
import pkg from '../package.json';
import log from './log';
import Xeon from './xeon';
import meow from 'meow';
import notifier from './notifier';
import { statSync } from 'fs';
import { readFile } from './file';
import prettyjson from 'prettyjson';

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

(() => {
  function configsLookup() {
    try {
      // if there is no flags search for config file
      if (!Object.keys(cli.flags).length) {
        const configFilePath = path.join(process.cwd(), '.xeonconf.json');
        const stats = statSync(configFilePath);
        if (stats.isFile()) return JSON.parse(readFile(configFilePath));
        throw new Error(`Could not find config file`);
      }
      // or return config from flags
      return {
        entry: cli.flags.input,
        output: cli.flags.output,
        allowExternal: cli.flags.external
      };
    } catch (error) {
      console.log(`Error while initing config object\n ${prettyjson.render(error)}`);
    }
  }

  let config = configsLookup();

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
})();
