export class TokenGenerator {
  source: string;
  tokens: string[];
  constructor(source) {
    this.source = source;
    this.tokens = this.source.split(/\s/); //array of current tokens;
    return this;
  }
  get() {
    if (!this.tokens.length) return;
    return this.tokens;
  }
}

export class Parser {
  tokens;
  _modified;
  constructor(tokens) {
    this.tokens = tokens;
    this._modified = [];
    return this;
  }
  parse(): Parser {
    let _current = 0;
    function getFunctionContent() {
      let content = [];
      while(this.tokens[_current] !== '}') {
        content.push(this.tokens[_current++]);
      }
      _current++;
      return content.join(' ');
    }
    while (_current < this.tokens.length) {
      let token = this.tokens[_current];
      if (token === 'test()' && this.tokens[++_current] === '{') {
        ++_current;
        let context = getFunctionContent.call(this);
        this._modified.push({
          type: 'FunctionDeclaration',
          name: token,
          context: context
        });
        continue;
      }
      this._modified.push({
        type: 'BaseSourceContent',
        value: token
      });
      _current++;
      continue;
    }
    return this;
  }
  get() {
    return this._modified;
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
