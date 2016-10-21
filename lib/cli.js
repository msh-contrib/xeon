#!/usr/bin/env node

'use strict';

const meow = require('meow')
const path = require('path')
const Promise = require('bluebird')
const coroutine = Promise.coroutine
const prettyjson = require('prettyjson')
const fs = require('fs')
const pkg = require('../package.json')
const log = require('./log')
const Xeon = require('./xeon')
const notifier = require('./notifier')
const readFile = require('./file').readFile

// // notify if there are some updates
// notifier(pkg)

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
)

var input = cli.flags.input
var output = cli.flags.output
var external = cli.flags.external
var watch = cli.flags.watch


// const configLookup = coroutine(function * () {
//   // async implementation for configuration lookup
// })


coroutine(function * () {
   // function configsLookup() {
  //   try {
  //     // if there is no flags search for config file
  //     if (!Object.keys(cli.flags).length) {
  //       const configFilePath = path.join(process.cwd(), '.xeonconf.json');
  //       const stats = statSync(configFilePath);
  //       if (stats.isFile()) return JSON.parse(readFile(configFilePath));
  //       throw new Error(`Could not find config file`);
  //     }
  //     // or return config from flags
  //     return {
  //       entry: cli.flags.input,
  //       output: cli.flags.output,
  //       allowExternal: cli.flags.external
  //     };
  //   } catch (error) {
  //     console.log(`Error while initing config object\n ${prettyjson.render(error)}`);
  //   }
  // }

  const xeon = new Xeon({
    entry: input,
    output: output,
    allowExternal: external
  })

  log(xeon)

  coroutine(function * () {
    yield xeon.buildDepsGraph()
    yield xeon.resolveDepsGraph()
    yield xeon.writeBundle()
  })()


  // function processBundle() {
  //   xeon.buildDepsGraph()
  //   // xeon.resolveDepsGraph()
  //   // xeon.writeBundle();
  // }

  // processBundle()

  // if (watch) {
  //   xeon.watchDeps((file) => {
  //     processBundle()
  //   })
  // }
})().catch(function (error)  {
  console.log(error)
})

