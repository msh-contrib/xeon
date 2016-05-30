'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app) {
  app.on('building_graph', function (data) {
    console.log(_chalk2.default.blue('[xeon]') + ' building dependency graph');
  });

  app.on('resolving_deps', function (data) {
    console.log(_chalk2.default.blue('[xeon]') + ' resolving dependencies');
  });

  app.on('bundle', function (data) {
    console.log(_chalk2.default.blue('[xeon]') + ' file ' + _chalk2.default.bgGreen(data.file) + ' was written at ' + _chalk2.default.magenta(data.output));
  });

  app.on('start_watch', function (data) {
    console.log(_chalk2.default.blue('[xeon]') + ' watching files...');
  });

  app.on('changes_detected', function (data) {
    console.log(_chalk2.default.blue('[xeon]') + ' ' + _chalk2.default.bgCyan('changes') + ' at ' + _chalk2.default.magenta(data.file));
  });
};