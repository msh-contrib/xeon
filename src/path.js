/**
 * [makePath description]
 * @param  {[type]} graph [description]
 * @param  {[type]} node  [description]
 * @return {[type]}       [description]
 */
function makePath(graph, node) {
	var selected = graph.getNode(node);
	var path = [selected];

	(function traverse(node) {
		var edges = node.getConnections();
		if (!edges.length) return;

		edges.forEach(function (node) {
			path.push(node);
			traverse(node);
		});
	})(selected);

	return path;
}

/**
 * [getUniqValues description]
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
function getUniqValues(path) {
	var uniq = [], i;

	for (i = path.length - 1; i >= 0; i--) {
		if (uniq.indexOf(path[i]) < 0) {
				uniq.push(path[i]);
		}
	}

	return uniq;
}

/**
 * [getResolvedPath description]
 * @param  {[type]} graph [description]
 * @param  {[type]} node  [description]
 * @return {[type]}       [description]
 */
function getResolvedPath(graph, node) {
	var unresolvedPath = makePath(graph, node);
	return getUniqValues(unresolvedPath);
}

module.exports = getResolvedPath;
