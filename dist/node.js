'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Node = function () {
  /**
   * @constructor
   * Represent single node of graph
   * @param {String} key
   */

  function Node(key, params) {
    _classCallCheck(this, Node);

    if (!(this instanceof Node)) return new Node(key, params);
    if (!key || typeof key !== 'string') throw new Error('uncorrect key of node');
    this.id = key;
    this.params = params;
    this.edges = []; // node connections
  }

  /**
   * @public
   * Add connection to current node
   * @param {Node} node
   */


  _createClass(Node, [{
    key: 'addEdge',
    value: function addEdge(node) {
      if (!node || !(node instanceof Node)) throw new Error('uncorrect node');
      if (this.edges.indexOf(node) > -1) return;
      this.edges.push(node);
    }

    /**
     * @public
     * Get list of all node neighbors
     * @return {Array} Array of neighbors
     */

  }, {
    key: 'getConnections',
    value: function getConnections() {
      return this.edges;
    }

    /**
     * @public
     * Get key of current node
     * @return {String}
     */

  }, {
    key: 'getId',
    value: function getId() {
      return this.id;
    }
  }]);

  return Node;
}();

exports.default = Node;