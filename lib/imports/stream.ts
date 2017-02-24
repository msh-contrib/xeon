/**
 * @class CharStream
 *
 * Base class for streaming characters
 * one by one from raw source string
 *
 * used by Lexer
 */
export class CharStream {
  source: string
  _pointer: number

  /**
   * Create CharStream instance
   * @param  {string} source
   */
  constructor(source: string) {
    this.source = source
    this._pointer = 0
  }

  /**
   * Get next character from source string
   * @returns {string}
   */
  readNextChar(): string {
    return this.source.charAt(this._pointer++)
  }

  /**
   * Peeking character on current position
   * in the source string
   * @returns {string}
   */
  peekCurrent(): string {
    return this.source.charAt(this._pointer)
  }

  /**
   * Get current pointer in source string
   * @returns {number}
   */
  getPointer(): number {
    return this._pointer
  }

  /**
   * Check if pointer reached EOF
   * of current source string
   * @returns {boolean}
   */
  get EOF(): boolean {
    return this._pointer >= this.source.length
  }
}
