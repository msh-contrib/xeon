/**
 * Shareable interface for Node class
 */
export interface IGraphNode {
  getConnections(): IGraphNode[]
  addEdge(node: IGraphNode): void,
  getId(): string
}

/**
 * Define single graph node
 * @class Node
 */
export class Dependency implements IGraphNode {
  private _id: string
  private _params: Object
  private _edges: Array<IGraphNode> = [] // node connections

  /**
   * @constructor
   * @param {string} key node identifier
   * @param {object} params node related params
   */
  constructor(key: string, params: Object) {
    if (!(this instanceof Node)) {
      return new Dependency(key, params)
    }

    this._id = key;
    this._params = params;
    this._edges = []; // node connections
  }

  /**
   * Add connection to node
   * @param {Node} node associated node
   */
  addEdge(node: IGraphNode): void {
    if (this._edges.indexOf(node) < 0) {
      this._edges.push(node)
    }
  }

  /**
   * Get all node's connections
   */
  getConnections(): Array<IGraphNode> {
    return this._edges
  }

  /**
   * Get node's identifier
   */
  getId(): string {
    return this._id
  }
}
