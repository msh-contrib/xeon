/**
 * [Node description]
 * @param {[type]} key [description]
 */
function Node(key) {
	this.id = key;
	this.edges = [];
}

/**
 * [addEdge description]
 * @param {[type]} node [description]
 */
Node.prototype.addEdge = function (node) {
	this.edges.push(node);
};

/**
 * [getConnections description]
 * @return {[type]} [description]
 */
Node.prototype.getConnections = function () {
	return this.edges;
};

/**
 * [getId description]
 * @return {[type]} [description]
 */
Node.prototype.getId = function () {
	return this.id;
};

/**
 * [Graph description]
 */
function Graph() {
	this._graph = {};
	this.directed = false;
}

/**
 * [addNode description]
 * @param {[type]} key [description]
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
	if (this._graph.hasOwnProperty(key)) {
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
 * [resolve description]
 * @param  {[type]} node [description]
 * @return {[type]}      [description]
 */
Graph.prototype.resolve = function (node) {
	var path = [].slice.call(arguments, 1) || [];
	path.push(node);
	console.log(path);
	var self = this;
	self._graph[node].getConnections().forEach(function (node) {
		self.resolve(node.id, path);
	});
};

/**
 * @param  {[type]} graph [description]
 * @param  {[type]} node  [description]
 * @return {[type]}       [description]
 */
function search(graph, node) {
	var marked = [];
	var path = [];
	var selected = graph.getNode(node);
	path.push(selected.id);

	(function traverse(node) {
		var edges = node.getConnections();
		for (var i = 0; i < edges.length; i++) {
				marked.push(edges[i]);
				path.push(edges[i].id);
				traverse(edges[i]);
		}
	})(selected);

	return path;

}

var g = new Graph();
g.addNode('app.js');
g.addEdge('app.js', 'jquery');
g.addEdge('app.js', 'nav.js');
g.addEdge('app.js', 'body.js');
g.addEdge('jquery', 'plugin');
g.addEdge('plugin', 'newone');
g.addEdge('nav.js', 'jquery');


var path = search(g, 'app.js');

var uniq = [];

for (var i = path.length - 1; i >= 0; i--) {
	if (uniq.indexOf(path[i]) < 0) {
		uniq.push(path[i]);
	}
}

console.log(uniq);
