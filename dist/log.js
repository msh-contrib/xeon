'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (app) {
  app.on('init', function (data) {
    console.log('starting application...');
  });

  app.on('end', function (data) {
    console.log('finising application...');
  });
};