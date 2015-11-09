var Node = require('./node');

// helper for more secure hasOwnProperty
function hasProperty(obj, prop) {
	return ({}).hasOwnProperty.call(obj, prop);
}

/**
 * @constructor
 * Represent graph data structure
 */
function Graph() {
	this._graph = {};
}

/**
 * @public
 * Add new node to curr graph
 * @param {String} key - key for new node
 */
Graph.prototype.addNode = function (key) {
	this._graph[key] = new Node(key);
};

/**
 * [getNode description]
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
Graph.prototype.getNode = function (key) {
	if (hasProperty(this._graph, key)) {
		return this._graph[key];
	}
};

/**
 * [addEdge description]
 * @param {[type]} start [description]
 * @param {[type]} end   [description]
 */
Graph.prototype.addEdge = function (start, end) {
	if (!this._graph.hasOwnProperty(start)) {
		this._graph[start] = new Node(start);
	}

	if (!this._graph.hasOwnProperty(end)) {
		this._graph[end] = new Node(end);
	}

	this._graph[start].addEdge(this._graph[end]);
};

/**
 * [getConnection description]
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
Graph.prototype.getConnection = function (key) {
	return this._graph[key].getConnections();
};

module.exports = Graph;
