'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _updateNotifier = require('update-notifier');

var _updateNotifier2 = _interopRequireDefault(_updateNotifier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (pkg) {
  var notifier = (0, _updateNotifier2.default)({
    packageName: pkg.name,
    packageVersion: pkg.version,
    updateCheckInterval: 1000 * 60 * 60 * 1
  });

  if (notifier.update) {
    notifier.notify();
  }
};