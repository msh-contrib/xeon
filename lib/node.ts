/**
 * Define single graph node
 * @class Node
 */
export class Node {
  private id: string
  private params: Object
  private edges: Array<Node>

  /**
   * @constructor
   * @param {string} key node identifier
   * @param {object} params node related params
   */
  public constructor(key: string, params: Object) {
    if (!(this instanceof Node)) {
      return new Node(key, params)
    }

    this.id = key;
    this.params = params;
    this.edges = []; // node connections
  }

  /**
   * Add connection to node
   * @param {Node} node associated node
   */
  public addEdge(node: Node): void {
    if (this.edges.indexOf(node) < 0) {
      this.edges.push(node)
    }
  }

  /**
   * Get all node's connections
   */
  public getConnections(): Array<Node> {
    return this.edges
  }

  /**
   * Get node's identifier
   */
  public getId(): string {
    return this.id
  }
}
