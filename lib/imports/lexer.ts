interface Token {
  type: string,
  value: string
}

const newLineChars = ['\n', '\r', '\f']

class CharStream {
  source: string
  cursor: number
  line: number
  column: number

  _currentChar: string

  constuctor(source: string) {
    this.source = source
    this.cursor = 0
    this.line = 1
    this.column = 0
  }

  readNextChar( ){
    const char = this.source.charAt(this.cursor++)

    if (newLineChars.indexOf(char) > -1) {
      ++this.line
      this.column = 0
    } else {
      ++this.column
    }

    return char
  }

  get EOF() {
    return this.cursor >= this.source.length
  }
}

export class ImportsLexer {
  source: string
  _currentToken: Token
  _stream: CharStream
  _currentChar: string

  allowedKeywords: Array<string> = [
    'import',
    'require', // just an alias
    'load',
    'from'
  ]

  constructor(source: string) {
    this.source = source
    this._stream = new CharStream()
  }

  readWhileHelper(predicate: (char: string) => boolean): string {
    var value = ''
    while (predicate(this._currentChar)) {
      value += this._currentChar
      this._currentChar = this._stream.readNextChar()
    }

    return value
  }

  nextToken(): Token {
    if (!this._stream.EOF) {
      this._currentChar = this._stream.readNextChar()

      if (/[a-z]/i.test(this._currentChar)) {
        // If char is identifier
        // get full string
        const identifier = this.readWhileHelper(function (char) {
          return /[a-z]/i.test(char)
        })

        if (this.allowedKeywords.indexOf(identifier) > -1) {
          return {
            type: 'keyword',
            value: identifier
          }
        } else {
          return {
            type: 'identifier',
            value: identifier
          }
        }
      } else if (this._currentChar == '(') {
        return {
          type: 'LBrace',
          value: this._currentChar
        }
      } else if (this._currentChar == ')') {
        return {
          type: 'RBrace',
          value: this._currentChar
        }
      } else {
        // pass
      }
    } else {
      console.error('<EOF')
    }
  }
}
