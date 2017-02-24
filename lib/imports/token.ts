import {TokenTypes} from './types'

/**
 * @class Token
 *
 * Base class for declaring single token structure
 */
export class Token {
  type: TokenTypes
  value: string

  /**
   * Create instance
   * @param  {AllowedTokenTypes} type
   * @param  {string} value
   */
  constructor(type: TokenTypes, value: string) {
    this.type = type
    this.value = value
  }
}
