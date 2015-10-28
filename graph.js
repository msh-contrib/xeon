function Node(key) {
	this.id = key;
	this.edges = [];
}

Node.prototype.addEdge = function (node) {
	this.edges.push(node);
};

Node.prototype.getConnections = function () {
	return this.edges;
};

Node.prototype.getId = function () {
	return this.id;
};


function Graph() {
	this._graph = {};
	this.directed = false;
}

Graph.prototype.addNode = function (key) {
	this._graph[key] = new Node(key);
};

Graph.prototype.getNode = function (key) {
	if (this._graph.hasOwnProperty(key)) {
		return this._graph[key];
	}
};

Graph.prototype.addEdge = function (start, end) {
	if (!this._graph.hasOwnProperty(start)) {
		this._graph[start] = new Node(start);
	}

	if (!this._graph.hasOwnProperty(end)) {
		this._graph[end] = new Node(end);
	}

	this._graph[start].addEdge(this._graph[end]);
};

Graph.prototype.getConnection = function (key) {
	return this._graph[key].getConnections();
};

Graph.prototype.resolve = function (node) {
	var path = [].slice.call(arguments, 1) || [];
	path.push(node);
	console.log(path);
	var self = this;
	self._graph[node].getConnections().forEach(function (node) {
		self.resolve(node.id, path);
	});
};


function DFS(graph, node) {
	var marked = [];
	var path = [];
	var selected = graph.getNode(node);
	path.push(selected.id);

	(function traverse(node) {
		var edges = node.getConnections();
		for (var i = 0; i < edges.length; i++) {
			if (marked.indexOf(edges[i]) < 0) {
				marked.push(edges[i]);
				path.push(edges[i].id);
				traverse(edges[i]);
			}
		}
	})(selected);

	return path;

}

var g = new Graph();
g.addNode('entry');
g.addEdge('entry', 'module1');
g.addEdge('entry', 'module2');
g.addEdge('module1', 'partial1');
g.addEdge('module1', 'module2');
g.addEdge('module2', 'dependency');

console.log(DFS(g, 'entry'));
