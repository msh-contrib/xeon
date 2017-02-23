import {ImportsLexer} from './lexer'

class ImportsParser {
  _lexer: ImportsLexer
  constructor (source: string) {
    this._lexer = new ImportsLexer(source)
  }
}
