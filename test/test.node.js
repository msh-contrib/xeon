var test = require('tape');
var Node = require('../lib/node');

test('Node should be a function', function (t) {
  t.plan(1);
  t.ok(typeof Node === 'function');
  t.end();
});

test('Node should create new object', function (t) {
  t.plan(1);
  var fixture = new Node('test');
  t.ok(fixture.toString() === '[object Object]');
  t.end();
});

test('Node should have proper key', function (t) {
  t.plan(3);
  t.throws(function () {
    var fixture = new Node({});
  });
  t.throws(function () {
    var fixture = new Node(12);
  });
  t.throws(function () {
    var fixture = new Node([]);
  });
  t.end();
});

test('Node.addEdge should properly add new node', function (t) {
  t.plan(2);
  var fixture = new Node('test');
  var testNode = new Node('fixture');
  t.ok(typeof fixture.addEdge === 'function');
  fixture.addEdge(testNode);
  t.deepEqual(fixture.edges[0], testNode);
  t.end();
});

test('Node should be created even without new', function (t) {
  t.plan(2);
  var fixture = Node('test');
  t.ok(fixture.toString() === '[object Object]');
  t.equal(fixture.id, 'test');
  t.end();
});

test('Node.getEdges should return available edges', function (t) {
  t.plan(1);
  var fixture = new Node('fixture');
  var testNode = new Node('test');
  fixture.addEdge(testNode);
  t.equal(fixture.edges, fixture.getConnections())
  t.end();
});
