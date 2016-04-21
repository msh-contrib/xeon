const SyntaxTokens = {
  lbracket: '{',
  rbracket: '}',
  lparen: '(',
  rparen: ')',
  whitespace: /\s/,
  num: /[0-9]/,
  name: /[a-z]/i,
  operator: /[+*-/]/,
  assign: '=',
  comma: ',',
  semicolumn: ';'
};

export class TokenGenerator {
  source;
  _tokens;
  constructor(source) {
    this.source = source;
    this._tokens = [];
    return this;
  }
  generate() {
    let _current = 0;
    while(_current < this.source.length) {
      let char = this.source[_current];
      if (char === SyntaxTokens.lbracket) {
        this._tokens.push({
          type: 'lbracket',
          value: char
        });
        _current++;
        continue;
      }
      if (char === SyntaxTokens.rbracket) {
        this._tokens.push({
          type: 'rbracket',
          value: char
        });
        _current++;
        continue;
      }
      if (char === SyntaxTokens.lparen) {
        this._tokens.push({
          type: 'lparen',
          value: char
        });
        _current++;
        continue;
      }
      if (char === SyntaxTokens.rparen) {
        this._tokens.push({
          type: 'rparen',
          value: char
        });
        _current++;
        continue;
      }
      if (SyntaxTokens.whitespace.test(char)) {
        _current++;
        continue;
      }
      if (SyntaxTokens.num.test(char)) {
        let _value = '';
        while(SyntaxTokens.num.test(char)) {
          _value += char;
          char = this.source[++_current];
        }
        this._tokens.push({
          type: 'num',
          value: _value
        });
        continue;
      }
      if (SyntaxTokens.name.test(char)) {
        let _value = '';
        while(SyntaxTokens.name.test(char)) {
          _value += char;
          char = this.source[++_current];
        }
        this._tokens.push({
          type: 'name',
          value: _value
        });
        continue;
      }
      if (char === SyntaxTokens.assign){
        this._tokens.push({
          type: 'equals',
          value: char
        });
        _current++;
        continue;
      }
      if (char === SyntaxTokens.comma){
        this._tokens.push({
          type: 'comma',
          value: char
        });
        _current++;
        continue;
      }
      if (char === SyntaxTokens.semicolumn){
        this._tokens.push({
          type: 'semicolumn',
          value: char
        });
        _current++;
        continue;
      }
      if (SyntaxTokens.operator.test(char)) {
        this._tokens.push({
          type: 'operator',
          value: char
        });
        _current++;
        continue;
      }
      throw new Error('generate(): unknown symbol:' + JSON.stringify(char));
    }
    return this;
  }
  get() {
    if (!this._tokens.length) return;
    return this._tokens;
  }
}

export class Parser {
  tokens;
  _ast;
  constructor(tokens) {
    this.tokens = tokens;
    this._ast = {type: 'Program', body: []};
    return this;
  }
  parse(): Parser {
    let current = 0;
    function walk() {
      let token = this.tokens[current];
      if (token.type === 'num') {
        current++;
        return {
          type: 'NumberLiteral',
          value: token.value
        };
      }
      current++;
      return {
        type: 'Statement',
        value: token.value
      };
    }
    while(current < this.tokens.length) {
      this._ast.body.push(walk.call(this));
    }
    return this;
  }
  get() {
    return this._ast;
  }
}

export class Transpiler {
  ast;
  _newAst;
  constructor(ast) {
    this.ast = ast;
    return this;
  }
  traverse() {
    this._newAst = this.ast.map((node) => {
      if (node.type && node.type === 'FunctionDeclaration') {
        return { type: node.type, name: 'export.'.concat(node.name), context: node.context }
      }
      return node;
    });
    return this;
  }
  get() {
    if (!this._newAst.length) return;
    return this._newAst;
  }
}

export class Generator{
  ast;
  sourceStr;
  constructor(ast){
    this.ast = ast;
    this.sourceStr = [];
    return this;
  }
  generate() {
    this.ast.forEach((node) => {
      if (node.type === 'FunctionDeclaration') {
        let _funcSrc = node.name + '{' + node.context + '}';
        this.sourceStr.push(_funcSrc);
        return;
      }
      if (node.type === 'BaseSourceContent') {
        this.sourceStr.push(node.value);
        return;
      }
      throw new TypeError('Unknown node: ' + JSON.stringify(node));
    });
    return this;
  }
  get() {
    return this.sourceStr.join(' ');
  }
}

let tokens = new TokenGenerator('test = 2; function test() { echo test; }').generate().get();
let ast = new Parser(tokens).parse().get();
console.log(ast);
