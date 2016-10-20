'use strict';

const utils = require('./utils')
const isObject = utils.isObject
const hasProperty = utils.hasProperty
const Node = require('./node')

class Graph {
  constructor() {
    if (!(this instanceof Graph)) { return new Graph() } ;
    this._graph = {};
  }

  addNode(key, params) {
    params = params || {};
    if (hasProperty(this._graph, key)) return;
    if (!isObject(params)) throw new TypeError('Should be an Object');
    this._graph[key] = new Node(key, params);
  }

  getNode(key) {
    if (!hasProperty(this._graph, key)) return;
    return this._graph[key];
  }

  addEdge(start, end) {
    var proto = this.constructor.prototype;
    proto.addNode.call(this, start);
    proto.addNode.call(this, end);
    this._graph[start].addEdge(this._graph[end]);
  }

  getConnection(key) {
    return (hasProperty(this._graph, key))
      ? this._graph[key].getConnections()
      : null
    ;
  }
}

module.exports = Graph
