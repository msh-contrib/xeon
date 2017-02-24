export enum AllowedTokenTypes {
  Unknown,
  Asterisk,
  Lbrace,
  Rbrace,
  Identifier,
  Literal,
  Keyword
}

export enum CharTypes {
  LBrace = 1,
  RBrace,
  Asterisk,
  Quote,
  DOuote,
  BackQuote
}

export const CharMap = {
  '(': CharTypes.LBrace,
  ')': CharTypes.RBrace,
  '\'': CharTypes.Quote,
  '"': CharTypes.DOuote,
  '`': CharTypes.BackQuote
}
