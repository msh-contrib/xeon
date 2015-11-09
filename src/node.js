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

module.exports = Node;
