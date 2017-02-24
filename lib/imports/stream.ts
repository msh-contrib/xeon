const newLineChars = ['\n', '\r', '\f']

interface Position {
  x: number,
  y: number
}

export class CharStream {
  source: string
  _cursor: number
  _position: Position

  constuctor(source: string) {
    this.source = source
    this._cursor = 0
    this._position = {
      y: 1,
      x: 0
    }
  }

  nextCharacter(): string {
    const char = this.source.charAt(this._cursor++)

    if (newLineChars.indexOf(char) > -1) {
      this._position.y += 1
      this._position.x = 0
    } else {
      this._position.x += 1
    }

    return char
  }

  peekCurrent(): string {
    return this.source.charAt(this._cursor)
  }

  getPosition() {
    return this._position
  }

  throwException(message) {
    throw new Error(message)
  }

  get EOF() {
    return this._cursor >= this.source.length
  }
}
