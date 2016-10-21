'use strict';
const Promise = require('bluebird')
const coroutine = Promise.coroutine
const Node = require('./node')

var depsChunk = coroutine(function * (node, resolved, unresolved) {
  unresolved.push(node)
  var allEdges = node.getConnections()
  var tasks = []
  for (var i = 0; i < allEdges.length; i++) {
    var edge = allEdges[i]
    if (resolved.indexOf(edge) < 0) {
      if (unresolved.indexOf(edge) < 0) {
        tasks.push(depsChunk(edge, resolved, unresolved))
      }
    }
  }
  resolved.push(node)
  unresolved.slice(unresolved.indexOf(node), 1)
  yield Promise.all(tasks)
})

var resolveDeps = coroutine(function * (node) {
  if (!(node instanceof Node) || !node) {
    throw new Error('Uncorrect value of node')
  }
  var unresolved = []
  var resolved = []

  yield depsChunk(node, resolved, unresolved)

  return resolved
})

module.exports = resolveDeps
