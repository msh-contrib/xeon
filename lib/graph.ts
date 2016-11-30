import {isObject, hasProperty} from './utils'
import Node from './node'

/* Interface for Graph class */
export interface IGraph {
  addNode(key: string, params: Object): void,
  getNode(key: string): Node,
  addEdge(start: string, end: string): void,
  getConnections(key: string): Node[]
}

function coroutine() {

}
/**
 * Class for defining abstract graph structure
 * @class Graph
 */
export class DepsGraph implements IGraph {
  graph: Object /* internal graph representation */

  constructor() {
    if (!(this instanceof DepsGraph)) {
      return new DepsGraph()
    }

    this.graph = {}
  }

  /**
   * Add new node to graph
   * @param {string} key node identifier
   * @param {object} params related node params
   */
  addNode(key: string, params: Object = {}): void{
    if (!hasProperty(this.graph, key)) {
      if (!isObject(params)) {
        throw new Error('Should be an object')
      }
      this.graph[key] = new Node(key, params)
    }
  }

  /**
   * Get specific node by key
   * @param {string} key node identifier
   * @returns {Node|undefined}
   */
  getNode(key: string): Node {
    if (hasProperty(this.graph, key)) {
      return this.graph[key]
    }
  }

  /**
   * Add connection between two nodes
   * @param {string} start node identifier
   * @param {string} end node identifier
   */
  addEdge(start: string, end: string): void {
    this.addNode(start)
    this.addNode(end)
    this.graph[start].addEdge(this.graph[end])
  }

  /**
   * Get connections for specific node
   * @param {string} key node identifier
   * @returs {array|undefined} node connections
   */
  getConnections(key: string): Node[] {
    if (hasProperty(this.graph, key)) {
      return this.graph[key].getConnections()
    }
  }
}
