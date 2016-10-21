const Promise = require('bluebird')
const coroutine = Promise.coroutine
const fs = require('fs')
const stat = Promise.promisify(fs.stat)
const read = Promise.promisify(fs.readFile)

module.exports = coroutine(function * (file) {
  var fileStat = yield stat(file)

  if (!fileStat.isFile()) {
    throw new Error('There is no such file')
  }

  return yield read(file)
})
