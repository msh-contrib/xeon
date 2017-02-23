import {isObject, hasProperty} from './utils'
import {Node} from './node'

interface GraphMap {
  [index: string]: Node
}

/**
 * Class for defining abstract graph structure
 * @class Graph
 */
export class Graph {
  _graph: GraphMap /* internal graph representation */

  constructor() {
    if (!(this instanceof Graph)) {
      return new Graph()
    }

    this._graph = {}
  }

  /**
   * Add new node to graph
   * @param {string} key node identifier
   * @param {object} params related node params
   */
  addNode(key: string, params: Object = {}): void{
    if (!hasProperty(this._graph, key)) {
      if (!isObject(params)) {
        throw new Error('Should be an object')
      }
      this._graph[key] = new Node(key, params)
    }
  }

  /**
   * Get specific node by key
   * @param {string} key node identifier
   * @returns {Node|undefined}
   */
  getNode(key: string): Node {
    if (hasProperty(this._graph, key)) {
      return this._graph[key]
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
    this._graph[start].addEdge(this._graph[end])
  }

  /**
   * Get connections for specific node
   * @param {string} key node identifier
   * @returs {array|undefined} node connections
   */
  getConnections(key: string): Node[] {
    if (hasProperty(this._graph, key)) {
      return this._graph[key].getConnections()
    }
  }
}
