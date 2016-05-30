'use strict';

export default class Node {
  constructor(key, params) {
    if (!(this instanceof Node)) return new Node(key, params);
    if (!key || typeof key !== 'string') throw new Error('uncorrect key of node');
    this.id = key;
    this.params = params;
    this.edges = []; // node connections
  }

  addEdge(node) {
    if (!node || !(node instanceof Node)) throw new Error('uncorrect node');
    if (this.edges.indexOf(node) > -1) return;
    this.edges.push(node);
  }

  getConnections() {
    return this.edges;
  }

  getId() {
    return this.id;
  }
}
