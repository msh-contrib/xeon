'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _node = require('./node');

var _node2 = _interopRequireDefault(_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (node) {
  if (!(node instanceof _node2.default) || !node) throw new Error('uncorrect value of node');
  var unresolved = [],
      resolved = [];

  (function walk(node, resolved, unresolved) {
    unresolved.push(node);
    var allEdges = node.getConnections();

    allEdges.forEach(function (edge) {
      if (resolved.indexOf(edge) < 0) {
        if (unresolved.indexOf(edge) > -1) return;
        walk(edge, resolved, unresolved);
      }
    });

    resolved.push(node);
    unresolved.slice(unresolved.indexOf(node), 1);
  })(node, resolved, unresolved);

  return resolved;
};