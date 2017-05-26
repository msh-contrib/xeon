import * as parse from 'bash-parser'
import {Scope} from './scope'

export interface ModuleConfig {
  filePath?: string
  source: string
}

export class Module {
  public filePath: string
  public source: string
  private ast: Object

  public constructor(config: ModuleConfig) {
    this.source = config.source
    this.filePath = config.filePath

    try {
      this.ast = parse(this.source)
    } catch (error) {
      console.error(error)
    }
  }

  public getDependencies() {}

  public get tree() {
    return this.ast
  }

  public set tree(value: any) {
    throw new Error('Can not assign to sealed value')
  }
}
