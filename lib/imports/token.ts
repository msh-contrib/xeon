import {AllowedTokenTypes} from './types'

export class Token {
  type: AllowedTokenTypes
  value: string

  constructor(type: AllowedTokenTypes, value: string) {
    this.type = type
    this.value = value
  }
}
