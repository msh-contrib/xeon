// import { EventEmitter } from 'events';
// import chokidar from 'chokidar';
// import resolver from './resolver';
// import buildDepsGraph from './deps-graph';
// import { getData, getPathes, mergeData } from './file';
// import { dirname, basename } from 'path';
// import outputFileSync from 'output-file-sync';
// import { resolvePath } from './utils';
// import prettyjson from 'prettyjson';

const EventEmitter = require('events')
const chokidar = require('chokidar')
const resolver = require('./resolver')
const buildDepsGraph = require('./deps-graph')
const file = require('./file')
const path = require('path')
const utils = require('./utils')
const resolvePath = utils.resolvePath
const prettyjson = require('prettyjson')
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

  // // build main deps graph
  // buildDesGraph() {
  //   try {
  //     this.emit('building_graph')
  //     this.graph = buildDepsGraph(this.entry, this._allowExternal)
  //   } catch(error) {
  //     console.log(error.message)
  //   }
  // }

  // // resolve dependecies order
  // resolveDepsGraph() {
  //   this.emit('resolving_deps')
  //   this.resolvedGraph = resolver(this.graph.getNode(this.entry))
  // }

  // // write main bundle file
  // writeBundle() {
  //   const dataList = getData(this.resolvedGraph)
  //   outputFileSync(this.output, mergeData(dataList), 'utf-8')
  //   this.emit('bundle', { file: basename(this.output), output: dirname(this.output) })
  // }

  // // watch deps and run callback on change
  // watchDeps(callback) {
  //   const watcher = chokidar.watch(getPathes(this.resolvedGraph), { ignoreInitial: true })
  //   watcher.on('ready', () => { this.emit('start_watch') })
  //   watcher.on('change', (file) => {
  //     this.emit('changes_detected', { file: basename(file) })
  //     callback(file)
  //   })
  // }
}

var proto = Xeon.prototype

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
  this.emit('bundle', {file: path.basename(this.output), output: path.dirname(this.output)})
})

module.exports = Xeon
