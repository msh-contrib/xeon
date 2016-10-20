'use strict';

const Node = require('./node')

function resolveDependencies(node) {
  if (!(node instanceof Node) || !node) throw new Error('uncorrect value of node');
  let unresolved = [], resolved = [];

  (function walk(node, resolved, unresolved) {
      unresolved.push(node);
      let allEdges = node.getConnections();

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
}

module.exports = resolveDependencies
