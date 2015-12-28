var test = require('tape');
var graph = require('../lib/graph');
	
var fixtures = {};
fixtures.graph = new graph.Graph();
fixtures.xgraph = graph.Graph();

test('graph should be properly created', function (t) {
	t.plan(2);
	t.ok(fixtures.graph instanceof graph.Graph);
	t.ok(
		fixtures.xgraph instanceof graph.Graph, 
		'should be instance of Graph even called without new'
	);
	t.end();
});

test('addNode should be defined', function (t) {
	t.plan(1);
	t.ok(typeof fixtures.graph.addNode === 'function', 'addNode should be a function');
	t.end();
});

test('addNode should proper work', function (t) {
	t.plan(3);
	fixtures.graph.addNode('test_key');
	t.ok(fixtures.graph._graph['test_key'], 'should add proper key');
	t.throws(function () { fixtures.graph.addNode({}) }, 'should throw on incorrect input');
	t.throws(function () { 
		fixtures.graph.addNode('correct_key', 'str')}, 
		'should throw when parameters not object');
	t.end();
});