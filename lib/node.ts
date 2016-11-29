/**
 * Shareable interface for Node class
 */
interface INode {
  getConnections(): Node[]
  addEdge(node: Node): void,
  getId(): string
}

/**
 * Define single graph node
 * @class Node
 */
export default class Node implements INode {
  private _id: string
  private _params: Object
  private _edges: Node[] = [] // node connections

  /**
   * @constructor
   * @param {string} key node identifier
   * @param {object} params node related params
   */
  constructor(key: string, params: Object) {
    if (!(this instanceof Node)) {
      return new Node(key, params)
    }

    this._id = key;
    this._params = params;
    this._edges = []; // node connections
  }

  /**
   * Add connection to node
   * @param {Node} node associated node
   */
  addEdge(node: Node) {
    if (this._edges.indexOf(node) < 0) {
      this._edges.push(node)
    }
  }

  /**
   * Get all node\s connections
   */
  getConnections(): Node[] {
    return this._edges
  }

  /**
   * Get node's identifier
   */
  getId() {
    return this._id
  }
}
