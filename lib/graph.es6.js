"use strict";

const helpers = require('./utils');

class Node {
  constructor(key, params) {
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

class Graph {
  constructor() {
    this._graph = {};
  }

  addNode(key, params={}) {
    if (helpers.hasProperty(this._graph, key)) return;
    if (!helpers.isObject(params)) throw new TypeError('Should be an Object');

    this._graph[key] = new Node(key, params);
  }

  getNode(key) {
    if (!helpers.hasProperty(this._graph, key)) return;
    return this._graph[key];
  }

  addEdge(start, end) {
    const proto = this.constructor.prototype;
      
    proto.addNode.call(this, start);
    proto.addNode.call(this, end);

    this._graph[start].addEdge(this._graph[end]);
  }

  getConnection(key) {
    return (helpers.hasProperty(this._graph, key))
      ? this._graph[key].getConnections()
      : null
    ;
  }
}

/**
 * resolve dependency order
 */
function resolve(node) {
  if (!(node instanceof Node) || !node) throw new Error('uncorrect value of node');
  const unresolved = [], resolved = [];

  (node, resolved, unresolved) => {
      unresolved.push(node);
      const allEdges = node.getConnections();

      allEdges.forEach(edge => {
        if (resolved.indexOf(edge) < 0) {
          if (unresolved.indexOf(edge) > -1) return;
          walk(edge, resolved, unresolved);
        }
      });

      resolved.push(node);
      unresolved.slice(unresolved.indexOf(node), 1);
  }(node, resolved, unresolved);

  return resolved;
}

module.exports = {
  Graph: Graph,
  resolve: resolve
};