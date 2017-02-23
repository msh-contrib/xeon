import shParser from 'bash-parser'

export class Module {
  name: string
  ast: Object

  constructor(name: string, source: string) {
    this.name = name

    try {
      this.ast = shParser(source)
    } catch (error) {
      console.log(error)
    }
  }
}
