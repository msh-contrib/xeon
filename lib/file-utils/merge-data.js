const Promise = require('bluebird')
const coroutine = Promise.coroutine
const utils = require('../utils')

module.exports = coroutine(function * (data) {
  if (!Array.isArray(data)) {
    throw new Error('data should be a string')
  }

  var shebang = utils.correctShebang.concat(utils.EOL)

  return data.reduce((acc, curr) =>
    acc.concat(utils.replaceShebang(curr).concat(utils.EOL))
    , shebang)
})
