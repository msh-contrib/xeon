'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('./events');

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Xeon = function (_EventEmitter) {
  _inherits(Xeon, _EventEmitter);

  function Xeon() {
    _classCallCheck(this, Xeon);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Xeon).call(this));
  }

  _createClass(Xeon, [{
    key: 'watchFiles',
    value: function watchFiles(pathes, callback) {
      var _this2 = this;

      var watcher = _chokidar2.default.watch(pathes, { ingoreInitial: true });
      watcher.on('ready', function () {
        _this2.emit('start:watch');
      });
      watcher.on('change', function () {
        _this2.emit('changes');
      });
    }
  }]);

  return Xeon;
}(_events.EventEmitter);

exports.default = Xeon;