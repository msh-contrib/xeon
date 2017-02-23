/**
 * Define single graph node
 * @class Node
 */
export class Node {
  _id: string
  _params: Object
  _edges: Array<Node>

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
  addEdge(node: Node): void {
    if (this._edges.indexOf(node) < 0) {
      this._edges.push(node)
    }
  }

  /**
   * Get all node's connections
   */
  getConnections(): Array<Node> {
    return this._edges
  }

  /**
   * Get node's identifier
   */
  getId(): string {
    return this._id
  }
}
