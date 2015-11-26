/**
 * @constructor
 * Represent single node of graph
 * @param {String} key
 */
function Node(key) {
	if (!key || typeof key !== 'string') throw new Error('uncorrect key of node');
	this.id = key;
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

/**
 * [resolveDependencyOrder description]
 * @param  {[type]} node       [description]
 * @param  {[type]} resolved   [description]
 * @param  {[type]} unresolved [description]
 * @return {[type]}            [description]
 */
function resolveDependencyOrder(node, resolved, unresolved) {
	if (!(node instanceof Node) || !node) throw new TypeError('uncorrect value of node');

	unresolved.push(node.id);
	var allEdges = node.getConnections();

	allEdges.forEach(function (edge) {
		if (resolved.indexOf(edge.id) < 0) {
			if (unresolved.indexOf(edge.id) > -1) return;
			resolveDependencyOrder(edge, resolved, unresolved);
		}
	});

	resolved.push(node.id);
	unresolved.slice(unresolved.indexOf(node.id), 1);

	return resolved;
}

module.exports = {
	resolve: resolveDependencyOrder,
	Graph: Graph
};

// var g = new Graph();
// g.addNode('app');
// g.addEdge('app', 'mod1');
// g.addEdge('app', 'mod2');
// g.addEdge('mod2', 'mod1');
// g.addEdge('mod1', 'submode');

// var path = resolveDependencyOrder(g.getNode('app'), [], []);
// console.log(path);
