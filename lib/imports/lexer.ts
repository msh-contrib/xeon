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

  constructor(source: string) {
    this.source = source
    this._stream = new CharStream()
  }

  nextToken() {
    if (!this._stream.EOF) {
      const char = this._stream.readNextChar()
    }
  }
}
