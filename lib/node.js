'use strict';

export default class Node {
  /**
   * @constructor
   * Represent single node of graph
   * @param {String} key
   */
  constructor(key, params) {
    if (!(this instanceof Node)) return new Node(key, params);
    if (!key || typeof key !== 'string') throw new Error('uncorrect key of node');
    this.id = key;
    this.params = params;
    this.edges = []; // node connections
  }

  /**
   * @public
   * Add connection to current node
   * @param {Node} node
   */
  addEdge(node) {
    if (!node || !(node instanceof Node)) throw new Error('uncorrect node');
    if (this.edges.indexOf(node) > -1) return;
    this.edges.push(node);
  }

  /**
   * @public
   * Get list of all node neighbors
   * @return {Array} Array of neighbors
   */
  getConnections() {
    return this.edges;
  }

  /**
   * @public
   * Get key of current node
   * @return {String}
   */
  getId() {
    return this.id;
  }
}
