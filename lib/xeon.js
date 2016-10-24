'use strict';

const EventEmitter = require('events')
const chokidar = require('chokidar')
const resolver = require('./resolver')
const buildDepsGraph = require('./deps-graph')
const file = require('./file-utils')
const path = require('path')
const utils = require('./utils')
const resolvePath = utils.resolvePath
const Promise = require('bluebird')
const coroutine = Promise.coroutine
const output = Promise.promisify(require('output-file'))

class Xeon extends EventEmitter {
  constructor(config = {}) {
    super()
    this.entry = resolvePath(config.entry)
    this.output = resolvePath(config.output || './bundle.sh')
    this._allowExternal = config.allowExternal || false
  }
}

const proto = Xeon.prototype

proto.buildDepsGraph = coroutine(function * () {
  this.emit('building_graph')
  this.graph = yield buildDepsGraph(this.entry, this.allowExternal)
})

proto.resolveDepsGraph = coroutine(function * () {
  this.emit('resolving_deps')
  this.resolvedGraph = yield resolver(this.graph.getNode(this.entry))
})

proto.writeBundle = coroutine(function * () {
  const dataList = yield file.getData(this.resolvedGraph)
  var data = yield file.mergeData(dataList)
  yield output(this.output, data, 'utf-8')
  this.emit('bundle', {
    file: path.basename(this.output),
    output: path.dirname(this.output)
  })
})

proto.watchDeps = coroutine(function * () {
  const watcher = chokidar.watch(getPaths(this.resolvedGraph), { ingnoreInitial: true })
  watcher.on('ready', () => this.emit('start:watch'))
  watcher.on('change', (file) => {
    this.emit('changes:detected', {
      file: basename(file)
    })
    callback(file)
  })
})

module.exports = Xeon
