'use strict';

var helpers = require('./utils');
var Node = require('./node');

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

module.exports = Graph;
