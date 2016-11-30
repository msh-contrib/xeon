// 'use strict';

// const Promise = require('bluebird')
// const coroutine = Promise.coroutine
// const Node = require('./node')

// var depsChunk = coroutine(function * (node, resolved, unresolved) {
//   unresolved.push(node)

//   var allEdges = node.getConnections()
//   var tasks = []

//   for (var i = 0; i < allEdges.length; i++) {
//     var edge = allEdges[i]
//     if (resolved.indexOf(edge) < 0) {
//       if (unresolved.indexOf(edge) < 0) {
//         tasks.push(depsChunk(edge, resolved, unresolved))
//       }
//     }
//   }

//   resolved.push(node)
//   unresolved.slice(unresolved.indexOf(node), 1)

//   yield Promise.all(tasks)
// })

// module.exports = coroutine(function * (node) {
//   if (!node || !(node instanceof Node)) {
//     throw new Error('Uncorrect value of node')
//   }

//   var unresolved = []
//   var resolved = []

//   yield depsChunk(node, resolved, unresolved)

//   return resolved
// })

import {IGraphNode, Dependency} from './node'

/**
 * Resolve dependencies graph order
 * @param  {IGraphNode} node
 * @returns Promise
 */
export async function depsResolver(node: IGraphNode): Promise<Array<IGraphNode>> {
  /* Lists of unresolved/resolved nodes */
  var unresolved: Array<IGraphNode> = []
  var resolved: Array<IGraphNode> = []

  /* Processing single dependency */
  async function depsChunk(edge: IGraphNode): Promise<void> {
    unresolved.push(node)

    const allEdges: Array<IGraphNode> = node.getConnections()
    /* Processing tasks queue */
    var queue: Array<Promise<void>> = []

    for (let i = 0; i < allEdges.length; i++) {
      const edge: IGraphNode = allEdges[i]
      if (resolved.indexOf(edge) < 0) {
        if (unresolved.indexOf(edge) < 0) {
          queue.push(depsChunk(edge))
        }
      }
    }

    resolved.push(node)
    unresolved.slice(unresolved.indexOf(node), 1)
    /* Wait for completing all sub-tasks */
    await Promise.all(queue)
  }

  /* Starting processing from initial node */
  await depsChunk(node)

  return resolved
}
