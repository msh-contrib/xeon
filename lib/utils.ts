import {platform} from 'os'
import shebangRegex from 'shebang-regex'
import {resolve, isAbsolute} from 'path'

/* Header regular expression */
const headerRegex: RegExp = /require\("(.*?)"\)/g

/* Cross-platform end of line */
const EOL: string = (!platform || platform() !== 'win32') ? '\n' : '\r\n'

/**
 * Regex for matching shebang
 */
const correctShebang: string = '#!/usr/bin/env bash'

/**
 * Replace shebang string
 */
const replaceShebang: Function = (data: string) => data.replace(shebangRegex, '')

/**
 * Convert object to corresponding string representation
 */
const toCorrectString = obj => ({}).toString.call(obj)

/**
 * Correct way for checking if value is an object
 */
const isObject: Function  = (value: any) => typeof value === 'object' && toCorrectString(value) === '[object Object]'

/**
 * Correct way for checking if object has a property
 */
const hasProperty: Function = (obj, prop) => ({}).hasOwnProperty.call(obj, prop)

/**
 * Check if string begins with
 */
const beginsWith: Function = (target, str) => target.slice(0, str.length) === str

/**
 * Resolve path
 */
const resolvePath: Function = file => isAbsolute(file) ? file : resolve(process.cwd(), file)

export {
  hasProperty,
  resolvePath,
  beginsWith,
  isObject,
  toCorrectString,
  replaceShebang,
  EOL,
  headerRegex
}
