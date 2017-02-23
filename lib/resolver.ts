import {Node} from './node'

/**
 * Resolve dependencies graph order
 * @param  {IGraphNode} node
 * @returns Promise
 */
export async function depsResolver(node: Node): Promise<Array<Node>> {
  /* Lists of unresolved/resolved nodes */
  var unresolved: Array<Node> = []
  var resolved: Array<Node> = []

  /* Processing single dependency */
  async function depsChunk(edge: Node): Promise<void> {
    unresolved.push(node)

    const allEdges: Array<Node> = node.getConnections()
    /* Processing tasks queue */
    var queue: Array<Promise<void>> = []

    for (let i = 0; i < allEdges.length; i++) {
      const edge: Node = allEdges[i]
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
