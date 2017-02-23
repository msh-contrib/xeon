const Promise = require('bluebird')
const coroutine = Promise.coroutine
const utils = require('../utils')

module.exports = coroutine(function * (data) {
  if (!data || typeof data !== 'string') {
    throw new Error('data should be a string')
  }

  var requires = data.match(utils.headerRegex) || []

  return requires.map((header) =>
    header.replace(utils.headerRegex, '$1')
  )
})

export function getIncludes(data: string) {

}
