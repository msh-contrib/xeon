const getData = require('./get-data')
const getPaths = require('./get-paths')
const mergeData = require('./merge-data')
const parseHeader = require('./parse-header')
const readFile = require('./read')

module.exports = {
  getData: getData,
  getPaths: getPaths,
  mergeData: mergeData,
  parseHeader: parseHeader,
  readFile: readFile
}
