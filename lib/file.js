'use strict';

const fs = require('fs');
const Promise = require('bluebird');
const utils = require('./utils');

const stat = Promise.promisify(fs.stat);
const read = Promise.promisify(fs.readFile);
const coroutine = Promise.coroutine;

// export function readFile(file) {
//   if (!statSync(file).isFile()) throw new Error(`file: ${file} could not be found`);
//   try { return readFileSync(file, 'utf-8'); } catch (error) {
//    throw new Error(`Error while reading file ${file}`);
//   }
// }

// export function mergeData(data) {
//   if (!Array.isArray(data)) throw TypeError(`data: ${data} should be a string`);
//   const shebang = utils.correctShebang.concat(utils.EOL);
//   return data.reduce( (acc, curr) => {
//     return acc.concat(utils.replaceShebang(curr).concat(utils.EOL) );
//   }, shebang);
// }

// export function parseHeader(data) {
//   if (!data || typeof data !== 'string') throw new Error(`data: ${data} should be a string`);
//   return (data.match(utils.headerRegex) || []).map( (header) => {
//     return header.replace(utils.headerRegex, '$1');
//   });
// }

// export function getPathes(resolvedGraph) {
//   if (!resolvedGraph) throw Error('resolvedGraph should be defined');
//   return resolvedGraph.map( (item) => {
//     return item.id;
//   });
// }

// export function getData(resolvedGraph) {
//   if (!resolvedGraph) throw new Error('resolved graph should be defined');
//   return resolvedGraph.map(function (item) {
//     return item.params.content;
//   });
// }

/**
 * Async operation for reading file
 * @param {String} file
 * @returns
 */
var readFile = coroutine(function * (file) {
  var fileStat = yield stat(file)

  if (!fileStat.isFile()) {
    return Promise.reject(new Error('There is no such file'))
  }

  return yield read(file)
})

module.exports = {
  readFile: readFile
}
