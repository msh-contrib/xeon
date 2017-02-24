import {CharStream} from './stream'
import {Token} from './token'

import {
  TokenTypes,
  CharTypes,
  CharMap
} from './types'

/**
 * Regular experssion for matching literal values
 */
const LITERAL_REGEX = /[a-z]/i


/**
 * Base class for lexeing raw source string
 * Exposes `tokenize` method
 * Produces list of tokens
 *
 * @class ImportsLexer
 */
export class ImportsLexer {
  source: string
  _stream: CharStream
  tokens: Array<Token>

  allowedKeywords: Array<string> = [
    'import',
    'require', // just an alias
    'load',
    'from'
  ]

  /**
   * Create instance
   * @param {string} source
   */
  constructor(source: string) {
    this.source = source
    this._stream = new CharStream(source)
    this.tokens = []
  }

  tokenizeLiteral(char: string): void {
    var value = String(char), token

    while ( LITERAL_REGEX.test(this._stream.peekCurrent()) ) {
      value += this._stream.readNextChar()
    }

    if ( this.allowedKeywords.indexOf(value) > -1 ) {
      this.tokens.push(new Token(TokenTypes.Keyword, value))
      return
    }

    this.tokens.push(new Token(TokenTypes.Identifier, value))
  }

  tokenizeQuote(char: string) {
    var value = String(this._stream.readNextChar())
    while (this._stream.peekCurrent() !== char && !this._stream.EOF) {
      value += this._stream.readNextChar()
    }
    this.tokens.push(new Token(TokenTypes.Literal, value))
    this._stream.readNextChar()
  }

  _quoteChar(type) {
    return (type == CharTypes.Quote || type == CharTypes.DOuote || type == CharTypes.BackQuote )
  }

  /**
   * Looking through raw source string and produces list of tokens
   * @returns {Array<Token>} list of found tokens
   */
  tokenize(): Array<Token> {
    while (!this._stream.EOF) {
      var char = this._stream.readNextChar()
      if (LITERAL_REGEX.test(char)) {
        const pointer = this._stream.getPointer()
        this.tokenizeLiteral(char)
        continue
      }
      const type = CharMap[char]
      if (type) {
        if (this._quoteChar(type)) {
          this.tokenizeQuote(char)
          continue
        }
        this.tokens.push(new Token(TokenTypes.Unknown, char))
      }
    }

    return this.tokens
  }
}
