// Copyright (c) 2016, Oleh Kuchuk <kuchuklehjs@gmail.com>
// Read license for more details
// Inspired by work of  Daniel Martí <mvdan@mvdan.cc>
// https://github.com/mvdan/sh/blob/master/token.go

// all available tokens
const TEXT_REGEX = /[a-z]/i;
const NUMBER_REGEX = /[0-9]/i;
const WHITESPACE_REGEX = /\s/i;
const TOKENS_MAP = {

};

// base iterable class
class __InputStream {
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

export default class Tokenizer extends __InputStream {
  constructor(source) {
    if (!source || typeof source !== 'string')
      throw new TypeError(`Accept string, but got ${typeof source}`);

    super(source);

    this._tokens = [];

    // dynamically generate handlers for each type of tokens
    Object.keys(TOKENS_MAP).forEach((tokenKey) => {
      let tokenType = TOKENS_MAP[tokenKey];
      this[`process${tokenType}`] = () => {
        this._tokens.push({
          type: tokenType,
          value: key
        });
      }
    });
  }

  buildLexer() {
    try {
      while(!this.current()) {
        let currentValue = this.next();

        // proceed on whitespace
        if (WHITESPACE_REGEX.test(_currentChar)) continue;

        // capture full value, we are not interested in a single letter
        if (TEXT_REGEX.test(currentValue)) {
          let value = String(currentValue);
          while(TEXT_REGEX.test(this.current())) value += this.next();
          this._tokens.push({ type: 'TextNode' /* node name should be revisited */, value: value });
        }

        // same thing for number node
        if (NUMBER_REGEX.test(currentValue)) {
          let value = String(currentValue);
          while(TEXT_REGEX.test(this.current())) value += this.next();
          this._tokens.push({ type: 'NumberNode' /* node name should be revisited */, value: value });
        }

        // process rest of the tokens
        this[`process${this.TokensMap[currentValue]}`]();
      }
      return this._tokens;
    } catch (error) {
      console.log(`Error occurs while processing symbol\n${error.message}`);
    }
  }
}
