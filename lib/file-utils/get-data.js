const Promise = require('bluebird')
const coroutine = Promise.coroutine

module.exports = coroutine(function * (resolvedGraph) {
  if (!resolvedGraph) {
    throw new Error('resolvedGraph should be defined')
  }

  return resolvedGraph.map((item) => item.params.content)
})
