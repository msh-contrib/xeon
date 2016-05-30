#!/usr/bin/env node

'use strict';

var _package = require('./package.json');

var _log = require('./log');

var _log2 = _interopRequireDefault(_log);

var _xeon = require('./xeon');

var _xeon2 = _interopRequireDefault(_xeon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cli = meow('\n    Usage\n      $ br ./test[.sh]\n\n    Options\n      --output  Specify output file directory\n      --watch   Watch for changes in required files and rebuild on the fly\n\n    version: ' + _package.version + '\n  ', {
  alias: {
    i: 'input',
    o: 'output',
    watch: 'watch'
  }
});

var config = {
  entry: cli.flags.input,
  output: cli.flags.output,
  watch: cli.flags.watch
};

(function (config) {
  if (!config.entry) return console.log('Entry file should be defined');
  var xeon = new _xeon2.default(config.entry, config.output);

  (0, _log2.default)(xeon);

  function processBundle() {
    xeon.buildDepsGraph();
    xeon.resolveDepGraph();
    xeon.writeBundle();
  }

  processBundle();

  if (config.watch) {
    console.log('start watching...');
  }
})(config);