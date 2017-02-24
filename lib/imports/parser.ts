import {ImportsLexer} from './lexer'
import {Token} from './token'

class ImportsParser {
  _lexer: ImportsLexer
  tokens: Array<Token> = []

  constructor (source: string) {
    this._lexer = new ImportsLexer(source)
  }

  _tokenize() {
    this.tokens = this._lexer.tokenize()
  }

  parse() {
    // pass
  }

  static parse() {
    // pass
  }
}
