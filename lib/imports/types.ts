/**
 * Limited types supported by parser for import statements
 */

/**
 * Supported types for single tokens
 * @type AllowedTokenTypes
 */
export enum TokenTypes {
  Unknown,
  Asterisk,
  Lbrace,
  Rbrace,
  Identifier,
  Literal,
  Keyword
}

/**
 * Supported character types
 * @type CharTypes
 */
export enum CharTypes {
  LBrace = 1,
  RBrace,
  Asterisk,
  Quote,
  DOuote,
  BackQuote
}

/**
 * Maps character value to specific char type
 */
export const CharMap = {
  '(': CharTypes.LBrace,
  ')': CharTypes.RBrace,
  '\'': CharTypes.Quote,
  '"': CharTypes.DOuote,
  '`': CharTypes.BackQuote
}
