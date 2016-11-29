// 'use strict';

// const EventEmitter = require('events')
// const chokidar = require('chokidar')
// const resolver = require('./resolver')
// const buildDepsGraph = require('./deps-graph')
// const file = require('./file-utils')
// const path = require('path')
// const utils = require('./utils')
// const resolvePath = utils.resolvePath
// const Promise = require('bluebird')
// const coroutine = Promise.coroutine
// const output = Promise.promisify(require('output-file'))

// // class Xeon extends EventEmitter {
// //   constructor(config = {}) {
// //     super()
// //     this.entry = resolvePath(config.entry)
// //     this.output = resolvePath(config.output || './bundle.sh')
// //     this._allowExternal = config.allowExternal || false
// //   }
// // }


// function Xeon() {
//   this.entry = resolvePath(config.entry)
//   this.output = resolvePath(config.output || './bundle.sh')
//   this._allowExternal = config.allowExternal || false
// }

// Xeon.prototype = {
//   buildDepsGraph: co()
// }

// proto.buildDepsGraph = coroutine(function * () {
//   this.emit('building_graph')
//   this.graph = yield buildDepsGraph(this.entry, this.allowExternal)
// })

// proto.resolveDepsGraph = coroutine(function * () {
//   this.emit('resolving_deps')
//   this.resolvedGraph = yield resolver(this.graph.getNode(this.entry))
// })

// proto.writeBundle = coroutine(function * () {
//   const dataList = yield file.getData(this.resolvedGraph)
//   var data = yield file.mergeData(dataList)
//   yield output(this.output, data, 'utf-8')
//   this.emit('bundle', {
//     file: path.basename(this.output),
//     output: path.dirname(this.output)
//   })
// })

// proto.watchDeps = coroutine(function * () {
//   const watcher = chokidar.watch(getPaths(this.resolvedGraph), { ingnoreInitial: true })
//   watcher.on('ready', () => this.emit('start:watch'))
//   watcher.on('change', (file) => {
//     this.emit('changes:detected', {
//       file: basename(file)
//     })
//     callback(file)
//   })
// })

// module.exports = Xeon

import {EventEmitter} from 'events'

interface ConfigObject extends Object {
  entry: string,
  output: string,
  allowExternal: boolean,
  packageProviders: string[],
  defaultProvider: string
}

/**
 * @class Xeon
 */
export default class Xeon extends EventEmitter {
  entry: string
  output: string
  private allowExternal: boolean
  graph: Object
  packageProviders: string[]

  constructor(config: ConfigObject = {
    entry: './index.sh',
    output: './bundle.sh',
    allowExternal: false,
    packageProviders: ['npm', 'bpkg'],
    defaultProvider: 'npm'
  }) {
    super()
    this.entry = config.entry
    this.output = config.output
    this.allowExternal = config.allowExternal
    this.packageProviders = config.packageProviders
  }

  /**
   * Constructing
   */
  async buildDependencyGraph() {
    this.emit('bulding_graph')
    this.graph = await buildDependencyGraph(this.entry, this.allowExternal)
  }
}
