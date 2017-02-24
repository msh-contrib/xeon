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

import {buildDepsGraph} from './deps-graph'
import * as utils from './utils'
import * as path from 'path'
import { EventEmitter } from 'events'

/**
 * Defines interface for configuration parameters
 */
interface ConfigObject {
  entry: string, // entry file path
  output?: string, // output path
  allowExternal?: boolean, // allow loading scripts from web
  packageProviders?: string[], // list of available package providers
  defaultProvider?: string // default package provider
  allowTreeTransforming?: boolean
  packagesRoot: string
  exec: boolean
}

export default class Xeon extends EventEmitter {
  config: ConfigObject
  // entry: string
  // output: string
  // allowExternal: boolean
  graph: Object
  // resolvedGraph: Object
  // packageProviders: Array<string>
  // defaultProvider: string

  constructor(config: ConfigObject) {
    super()
    this.config = config
    // this.entry = entry
    // this.output = output
    // this.allowExternal = allowExternal
    // this.packageProviders = packageProviders
    // this.defaultProvider = defaultProvider
  }

  /**
   * Construct dependency graph
   */
  async buildDependencyGraph() {
    this.emit('bulding_graph')
    this.graph = await buildDependencyGraph(this.entry, this.allowExternal)
  }

  /**
   * Resolve dependency graph
   */
  async resolveDependencyGraph(): Promise<void> {
    this.emit('resolving_graph')
    this.resolvedGraph = await resolver(this.graph.getNode(this.entry))
  }

  /**
   * Write bundle to file
   */
  async writeBundle(): Promise<void> {
    const dataList = await file.getData(this.resolvedGraph)
    var data = await file.mergeData(dataList)
    await output(this.output, data, 'utf-8')
    this.emit('bundle', {
      file: path.basename(this.output),
      output: path.dirname(this.output)
    })
  }

  wathcDependencies(cb: Function): void {
    const watcher = chokidar.watch(getPaths(this.resolvedGraph), { ingnoreInitial: true })
    watcher.on('ready', () => this.emit('start:watch'))
    watcher.on('change', (file: string) => {
      this.emit('changes:detected', {
        file: path.basename(file)
      })
      cb(file)
    })
  }
}
