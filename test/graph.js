var test = require('tape');
var graph = require('../lib/graph');

test('Graph should be properly created', function (t) {
	t.plan(2);

	var fixture = new graph.Graph();
	var fixture_graph = graph.Graph();

	t.ok(fixture instanceof graph.Graph);
	t.ok(fixture_graph instanceof graph.Graph, 'should be instance of Graph even called without new');

	t.end();
});
