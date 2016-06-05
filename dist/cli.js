#!/usr/bin/env node


'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _log = require('./log');

var _log2 = _interopRequireDefault(_log);

var _xeon = require('./xeon');

var _xeon2 = _interopRequireDefault(_xeon);

var _meow = require('meow');

var _meow2 = _interopRequireDefault(_meow);

var _notifier = require('./notifier');

var _notifier2 = _interopRequireDefault(_notifier);

var _fs = require('fs');

var _file = require('./file');

var _prettyjson = require('prettyjson');

var _prettyjson2 = _interopRequireDefault(_prettyjson);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// notify if there are some updates
(0, _notifier2.default)(_package2.default);

var cli = (0, _meow2.default)('\n    Usage\n      $ xeon -i ./index[.sh]\n\n    Options\n      --output -o Specify output file directory\n      --watch -w  Watch for changes in required files and rebuild on the fly\n\n    version: ' + _package2.default.version + '\n  ', {
  alias: {
    i: 'input',
    o: 'output',
    w: 'watch',
    e: 'external',
    h: 'help'
  }
});

(function () {
  function configsLookup() {
    try {
      // if there is no flags search for config file
      if (!Object.keys(cli.flags).length) {
        var configFilePath = _path2.default.join(process.cwd(), '.xeonconf.json');
        var stats = (0, _fs.statSync)(configFilePath);
        if (stats.isFile()) return JSON.parse((0, _file.readFile)(configFilePath));
        throw new Error('Could not find config file');
      }
      // or return config from flags
      return {
        entry: cli.flags.input,
        output: cli.flags.output,
        allowExternal: cli.flags.external
      };
    } catch (error) {
      console.log('Error while initing config object\n ' + _prettyjson2.default.render(error));
    }
  }

  var config = configsLookup();

  if (!config.entry) return console.log('Entry file should be defined');

  var xeon = new _xeon2.default(config);

  (0, _log2.default)(xeon);

  function processBundle() {
    xeon.buildDesGraph();
    xeon.resolveDepsGraph();
    xeon.writeBundle();
  }

  processBundle();

  if (cli.flags.watch) {
    xeon.watchDeps(function (file) {
      processBundle();
    });
  }
})();