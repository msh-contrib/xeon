'use strict';

import {statSync} from 'fs';
import {correctShebang, EOL, replaceShebang, headerRegex} from './utils';

export default {
  readFile(file) {
    if (!statSync(file).isFile()) throw new Error(`file: ${file} could not be found`);
    try { return fs.readFileSync(file, 'utf-8'); } catch (error) {
     throw new Error(`Error while reading file ${file}`);
    }
  },

  mergeData(data) {
    if (!Array.isArray(data)) throw TypeError(`data: ${data} should be a string`);
    const shebang = correctShebang.concat(EOL);
    return data.reduce( (acc, curr) => {
      return acc.concat(replaceShebang(curr).concat(EOL) );
    }, shebang);
  },

  parseHeader(data) {
    if (!data || typeof data !== 'string') throw new Error(`data: ${data} should be a string`);
    return (data.match(headerRegex) || []).map( (header) => {
      return header.replace(headerRegex, '$1');
    });
  },

  getPathes(resolvedGraph) {
    if (!resolvedGraph) throw Error('resolvedGraph should be defined');
    return resolvedGraph.map( (item) => {
      return item.id;
    });
  },

  getData(resolvedGraph) {
    if (!resolvedGraph) throw Error('resolvedGraph should be defined');
    return resolvedGraph.map(function (item) {
      return item.params.content;
    });
  }
}
