'use strict';

/**
 * Define single graph node
 * @class Node
 */
class Node {

  /**
   * @constructor
   * @param {string} key node identifier
   * @param {object} params node related params
   */
  constructor(key, params) {
    if (!(this instanceof Node)) {
      return new Node(key, params)
    }

    if (!key || typeof key !== 'string') {
      throw new Error('uncorrect key of node')
    }

    this.id = key;
    this.params = params;
    this.edges = []; // node connections
  }

  /**
   * Add connection to node
   * @param {Node} node associated node
   */
  addEdge(node) {
    if (!node || !(node instanceof Node)) {
      throw new Error('uncorrect node')
    }

    if (this.edges.indexOf(node) < 0) {
      this.edges.push(node)
    }
  }

  /**
   * Get all node\s connections
   */
  getConnections() {
    return this.edges;
  }

  /**
   * Get node\s identifier
   */
  getId() {
    return this.id;
  }
}

module.exports = Node
