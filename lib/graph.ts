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
  private graph: GraphMap /* internal graph representation */

  public constructor() {
    if (!(this instanceof Graph)) {
      return new Graph()
    }

    this.graph = {}
  }

  /**
   * Add new node to graph
   * @param {string} key node identifier
   * @param {object} params related node params
   */
  public addNode(key: string, params: Object = {}): void {
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
  public getNode(key: string): Node {
    if (hasProperty(this.graph, key)) {
      return this.graph[key]
    }
  }

  /**
   * Add connection between two nodes
   * @param {string} start node identifier
   * @param {string} end node identifier
   */
  public addEdge(start: string, end: string): void {
    this.addNode(start)
    this.addNode(end)
    this.graph[start].addEdge(this.graph[end])
  }

  /**
   * Get connections for specific node
   * @param {string} key node identifier
   * @returs {array|undefined} node connections
   */
  public getConnections(key: string): Node[] {
    if (hasProperty(this.graph, key)) {
      return this.graph[key].getConnections()
    }
  }
}
