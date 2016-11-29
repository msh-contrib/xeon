import {isObject, hasProperty} from './utils'
import Node from './node'

/* Interface for Graph class */
interface IGraph {
  addNode(key: string, params: Object): void,
  getNode(key: string): Node
}

/**
 * Class for defining abstract graph structure
 * @class Graph
 */
export default class Graph implements IGraph {
  graph: Graph

  constructor() {
    if (!(this instanceof Graph)) {
      return new Graph()
    }
  }

  /**
   * Add new node to graph
   * @param {string} key node identifier
   * @param {object} params related node params
   */
  addNode(key: string, params: Object = {}) {
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
  getNode(key) {
    if (hasProperty(this.graph, key)) {
      return this.graph[key]
    }
  }

  /**
   * Add connection between two nodes
   * @param {string} start node identifier
   * @param {string} end node identifier
   */
  addEdge(start, end) {
    this.addNode(start)
    this.addNode(end)
    this.graph[start].addEdge(this.graph[end])
  }

  /**
   * Get connections for specific node
   * @param {string} key node identifier
   * @returs {array|undefined} node connections
   */
  getConnections(key) {
    if (hasProperty(this.graph, key)) {
      return this.graph[key].getConnections()
    }
  }
}
