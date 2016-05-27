var Node = require('./node');

module.exports = function resolve(node) {
  if (!(node instanceof Node) || !node) throw new Error('uncorrect value of node');
  var unresolved = [], resolved = [];

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
}
