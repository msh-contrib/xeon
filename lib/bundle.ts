import { Graph } from './graph'
import { getLocation } from './find'
import { Module } from './module'
import { readFile } from './file'
import {Scope} from './scope'

interface Options {
  partialImports?: boolean
  allowExternals?: boolean
}

interface EntryConfig {
  name: string
  rawSource: string
  path: string
}

interface BundleConfig {
  entry: EntryConfig
  options: Options
}

export class Bundle {
  public entry: EntryConfig
  public options: Options
  public partialImports: boolean = false
  public allowExternals: boolean = false
  public modules: Array<Module> = []
  public entryModule: Module
  private graph: Graph
  private resolvedGraph: Graph

  public constructor (config: BundleConfig) {
    this.options = config.options
    this.entry = config.entry

    // initialize empty modules graph
    this.graph = new Graph()

    if (this.options.partialImports) {
      this.partialImports = this.options.partialImports
    }

    if (this.options.allowExternals) {
      this.allowExternals = this.options.allowExternals
    }

  }

  public async buildBundle() {
    //const content = await readFile(getLocation(this.entry, 0))
    this.entryModule = new Module({
      source: this.entry.rawSource
    })

    const scope = new Scope()

    this.entryModule.tree.commands.forEach(function (command) {
      switch (command.type) {
        case 'Function':
          scope.set(command.name.text, command)
          break
      }
    })

    console.log('Scope', scope)
  }
}
