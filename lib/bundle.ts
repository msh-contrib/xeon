import {Graph} from './graph'
import {getLocation} from './find'
import {Module} from './module'
import {readFile} from './file'

interface BundleConfig {
  entry: string,
  partialImports?: boolean // allow usage of partial module imports
  allowExternals?: boolean
}

class Bundle {
  entry: string
  options: BundleConfig
  _graph: Graph
  _resolvedGraph: Graph
  partialImports: boolean = false
  allowExternals: boolean = false

  constructor(options: BundleConfig) {
    this.options = options
    this.entry = options.entry

    // initialize empty modules graph
    this._graph = new Graph()

    if (this.options.partialImports) {
      this.partialImports = this.options.partialImports
    }

    if (this.options.allowExternals) {
      this.allowExternals = this.options.allowExternals
    }

  }

  buildBundle() {
    readFile(getLocation(this.entry, 0)).then(function (content) {
      console.log(content)

    })

  }
}
