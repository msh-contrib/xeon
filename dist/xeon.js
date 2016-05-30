'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('./events');

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _resolver = require('./resolver');

var _resolver2 = _interopRequireDefault(_resolver);

var _buildDesGraph2 = require('./buildDesGraph');

var _buildDesGraph3 = _interopRequireDefault(_buildDesGraph2);

var _file = require('./file');

var _file2 = _interopRequireDefault(_file);

var _path = require('path');

var _outputFileSync = require('output-file-sync');

var outputFileSync = _interopRequireWildcard(_outputFileSync);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Xeon = function (_EventEmitter) {
  _inherits(Xeon, _EventEmitter);

  function Xeon(entry) {
    var output = arguments.length <= 1 || arguments[1] === undefined ? './bundle.sh' : arguments[1];

    _classCallCheck(this, Xeon);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Xeon).call(this));

    _this.entry = _this._resolvePath(entry);
    _this.output = _this._resolvePath(output);
    _this.emit('init');
    return _this;
  }

  _createClass(Xeon, [{
    key: '_resolvePath',
    value: function _resolvePath(file) {
      return (0, _path.isAbsolute)(file) ? file : (0, _path.resolve)(process.cwd(), file);
    }

    // build main deps graph

  }, {
    key: 'buildDesGraph',
    value: function buildDesGraph() {
      try {
        this.emit('building_graph');
        this.graph = (0, _buildDesGraph3.default)(this.entry);
        return this;
      } catch (error) {
        console.log('Error while building dependecies graph ' + JSON.stringify(error));
      }
    }

    // resolve dependecies order

  }, {
    key: 'resolveDepsGraph',
    value: function resolveDepsGraph() {
      try {
        this.emit('resolving_deps');
        this.resolvedDeps = (0, _resolver2.default)(this.graph.getNode(this.entry));
        return this;
      } catch (error) {
        console.log('Error while resolving dependecies ' + JSON.stringify(error));
      }
    }

    // write main bundle file

  }, {
    key: 'writeBundle',
    value: function writeBundle() {
      try {
        var dataList = _file2.default.getData(this.resolvedGraph);
        outputFileSync(this.output, _file2.default.mergeData(dataList), 'utf-8');
        this.emit('bundling');
        return this;
      } catch (error) {
        console.log('Error while writing bundle: ' + JSON.stringify(error));
      }
    }

    // watch deps and run callback on change

  }, {
    key: 'watchDeps',
    value: function watchDeps(callback) {
      var _this2 = this;

      var watcher = _chokidar2.default.watch(_file2.default.getPathes(this.resolvedGraph), { ignoreInitial: true });
      watcher.on('ready', function () {
        _this2.emit('start_watch');
      });
      watcher.on('change', function (file) {
        _this2.emit('changes_detected', { file: file });
        callback(file);
      });
      return this;
    }
  }]);

  return Xeon;
}(_events.EventEmitter);

exports.default = Xeon;