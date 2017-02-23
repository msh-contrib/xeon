import parse from 'bash-parser'

export class Module {
  filePath: string
  source: string
  ast: Object

  constructor({ filePath, source }) {
    this.source = source
    this.filePath = filePath
    try {
      this.ast = parse(source)
    } catch (error) {
      console.error('Parsing error')
    }
  }

  getDependencies() {}
}
