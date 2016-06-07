// Copyright (c) 2016, Oleh Kuchuk <kuchuklehjs@gmail.com>
// Read license for more details
// Inspired by work of  Daniel Martí <mvdan@mvdan.cc>
// https://github.com/mvdan/sh/blob/master/token.go

// Accept source string and return iterate object
class InputStream {
  constructor(source) {
    this.source = source;
    this._cursor = 0;
    this._position = { line: 1, column: 0 };
  }
  next() {
    let currentChar = this.source.charAt(this._cursor++);
    if (currentChar === '\n') {
      this._position.line++;
      this._position.column=0;
      return currentChar;
    }
    this._position.column++;
    return currentChar;
  }
  current() { return this.source.charAt(this._cursor); }
}

// Weird :shit: but small!
export default class Tokenizer extends InputStream {
  constructor(source, TokensMap = {}) {
    if (!source || typeof source !== 'string')
      throw new TypeError(`Accept string, but ${typeof source}`);
    super(source);
    this._tokens = [];
    this.TokensMap = TokensMap;
    Object.keys(this.TokensMap).forEach((key) => {
      let _TokenType = this.TokensMap[key];
      this[`process${_TokenType}`] = () => {
        this._tokens.push({
          type: _TokenType,
          value: key
        });
      }
    });
  }
  buildLexer() {
    try {
      while(!this.current()) {
        let _ch = this.next();
        if (/\s/i.test(_ch)) continue;
        if (/[a-z]/i.test(_ch)) {
          let _value = String(currentValue);
          while(/[0-9]/ig.test(this.current())) _value += this.next();
          this._tokens.push({ type: 'TextNode', value: _value });
        }
        this[`process${this.TokensMap[_ch]}`]();
      }
      return this._tokens;
    } catch (error) {
      console.log(`Error occurs while processing symbol\n${error.message}`);
    }
  }
}
