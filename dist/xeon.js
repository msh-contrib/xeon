'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _resolver = require('./resolver');

var _resolver2 = _interopRequireDefault(_resolver);

var _depsGraph = require('./deps-graph');

var _depsGraph2 = _interopRequireDefault(_depsGraph);

var _file = require('./file');

var _path = require('path');

var _outputFileSync = require('output-file-sync');

var _outputFileSync2 = _interopRequireDefault(_outputFileSync);

var _utils = require('./utils');

var _prettyjson = require('prettyjson');

var _prettyjson2 = _interopRequireDefault(_prettyjson);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Xeon = function (_EventEmitter) {
  _inherits(Xeon, _EventEmitter);

  function Xeon() {
    var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Xeon);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Xeon).call(this));

    _this.entry = (0, _utils.resolvePath)(config.entry);
    _this.output = (0, _utils.resolvePath)(config.output || './bundle.sh');
    _this._allowExternal = config.allowExternal || false;
    return _this;
  }

  // build main deps graph


  _createClass(Xeon, [{
    key: 'buildDesGraph',
    value: function buildDesGraph() {
      try {
        this.emit('building_graph');
        this.graph = (0, _depsGraph2.default)(this.entry, this._allowExternal);
        return this;
      } catch (error) {
        console.log('Error while building graph\n ' + _prettyjson2.default.render(error));
      }
    }

    // resolve dependecies order

  }, {
    key: 'resolveDepsGraph',
    value: function resolveDepsGraph() {
      try {
        this.emit('resolving_deps');
        this.resolvedGraph = (0, _resolver2.default)(this.graph.getNode(this.entry));
        return this;
      } catch (error) {
        console.log('Error while resolving graph\n ' + _prettyjson2.default.render(error));
      }
    }

    // write main bundle file

  }, {
    key: 'writeBundle',
    value: function writeBundle() {
      try {
        var dataList = (0, _file.getData)(this.resolvedGraph);
        (0, _outputFileSync2.default)(this.output, (0, _file.mergeData)(dataList), 'utf-8');
        this.emit('bundle', { file: (0, _path.basename)(this.output), output: (0, _path.dirname)(this.output) });
        return this;
      } catch (error) {
        console.log('Error while writing bundle\n ' + _prettyjson2.default.render(error));
      }
    }

    // watch deps and run callback on change

  }, {
    key: 'watchDeps',
    value: function watchDeps(callback) {
      var _this2 = this;

      var watcher = _chokidar2.default.watch((0, _file.getPathes)(this.resolvedGraph), { ignoreInitial: true });
      watcher.on('ready', function () {
        _this2.emit('start_watch');
      });
      watcher.on('change', function (file) {
        _this2.emit('changes_detected', { file: (0, _path.basename)(file) });
        callback(file);
      });
      return this;
    }
  }]);

  return Xeon;
}(_events.EventEmitter);

exports.default = Xeon;