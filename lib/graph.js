'use strict';

var helpers = require('./utils');

/**
 * @constructor
 * Represent single node of graph
 * @param {String} key
 */
function Node(key, params) {
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
Node.prototype.addEdge = function (node) {
  if (!node || !(node instanceof Node)) throw new Error('uncorrect node');
  if (this.edges.indexOf(node) > -1) return;
  this.edges.push(node);
};

/**
 * @public
 * Get list of all node neighbors
 * @return {Array} Array of neighbors
 */
Node.prototype.getConnections = function () {
  return this.edges;
};

/**
 * @public
 * Get key of current node
 * @return {String}
 */
Node.prototype.getId = function () {
  return this.id;
};

/**
 * @constructor
 * Represent graph data structure
 */
function Graph() {
  if (!(this instanceof Graph)) { return new Graph() } ;
  this._graph = {};
}

/**
 * @public
 * Add new node to curr graph
 * @param {String} key - key for new node
 */
Graph.prototype.addNode = function (key, params) {
  params = params || {};

  if (helpers.hasProperty(this._graph, key)) return;
  if (!helpers.isObject(params)) throw new TypeError('Should be an Object');

  this._graph[key] = new Node(key, params);
};

/**
 * @public
 * get node instance by key
 * @param  {String} key [description]
 * @return {Node} node object
 */
Graph.prototype.getNode = function (key) {
  if (!helpers.hasProperty(this._graph, key)) return;
  return this._graph[key];
};

/**
 * @public
 * add edge between two nodes,
 * if nodes not presented, create it
 * @param {String} start - key of start node
 * @param {String} end   - key of end node
 */
Graph.prototype.addEdge = function (start, end) {
  var proto = this.constructor.prototype;
    
  proto.addNode.call(this, start);
  proto.addNode.call(this, end);

  this._graph[start].addEdge(this._graph[end]);
};

/**
 * get node connection
 * @param  {String} key
 * @return {Array}
 */
Graph.prototype.getConnection = function (key) {
  return (helpers.hasProperty(this._graph, key))
    ? this._graph[key].getConnections()
    : null
  ;
};

/**
 * resolve dependency order
 */
function resolve(node) {
  if (!(node instanceof Node) || !node) throw new Error('uncorrect value of node');
  var unresolved = [], resolved = [];

  (function walk(node, resolved, unresolved) {
      unresolved.push(node);
      var allEdges = node.getConnections();

      allEdges.forEach(function (edge) {
        if (resolved.indexOf(edge) < 0) {
          if (unresolved.indexOf(edge) > -1) return;
          walk(edge, resolved, unresolved);
        }
      });

      resolved.push(node);
      unresolved.slice(unresolved.indexOf(node), 1);
  })(node, resolved, unresolved);

  return resolved;
}

module.exports = {
  Graph: Graph,
  resolve: resolve
};
