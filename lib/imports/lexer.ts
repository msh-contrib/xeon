import {CharStream} from './stream'
import {Token} from './token'

import {
  AllowedTokenTypes,
  CharTypes,
  CharMap
} from './types'

const LITERAL_REGEX = /[a-z]/i

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

  constructor(source: string) {
    this.source = source
    this._stream = new CharStream()
    this.tokens = []
  }

  tokenizeLiteral(): void {
    var value = '', token

    while ( LITERAL_REGEX.test(this._stream.peekCurrent()) ) {
      value += this._stream.nextCharacter()
    }

    if ( this.allowedKeywords.indexOf(value) > -1 ) {
      this.tokens.push(new Token(AllowedTokenTypes.Keyword, value))
      return
    }

    this.tokens.push(new Token(AllowedTokenTypes.Identifier, value))
  }

  tokenizeQuote() {
    return []
  }

  _quoteChar(type) {
    return (type == CharTypes.Quote || type == CharTypes.DOuote || type == CharTypes.BackQuote )
  }

  tokenize(): Array<Token> {
    while (!this._stream.EOF) {
      var char = this._stream.nextCharacter()
      if (LITERAL_REGEX.test(char)) {
        this.tokenizeLiteral()
        continue
      }
      const type = CharMap[char]
      if (type) {
        if (this._quoteChar(type)) {
          this.tokenizeQuote()
          continue
        }
        this.tokens.push(new Token(AllowedTokenTypes.Unknown, char))
      }
    }

    return this.tokens
  }
}
