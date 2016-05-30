'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (app) {
  app.on('building_graph', function (data) {
    console.log('building deps graph');
  });

  app.on('resolving_deps', function (data) {
    console.log('resolving deps');
  });

  app.on('bundle', function (data) {
    console.log('file was written');
  });

  app.on('changes_detected', function (data) {
    console.log('detected changes');
  });
};