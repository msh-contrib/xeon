'use strict';

import { statSync, readFileSync } from 'fs';
import { correctShebang, EOL, replaceShebang, headerRegex } from './utils';

export function readFile(file) {
  if (!statSync(file).isFile()) throw new Error(`file: ${file} could not be found`);
  try { return readFileSync(file, 'utf-8'); } catch (error) {
   throw new Error(`Error while reading file ${file}`);
  }
}

export function mergeData(data) {
  if (!Array.isArray(data)) throw TypeError(`data: ${data} should be a string`);
  const shebang = correctShebang.concat(EOL);
  return data.reduce( (acc, curr) => {
    return acc.concat(replaceShebang(curr).concat(EOL) );
  }, shebang);
}

export function parseHeader(data) {
  if (!data || typeof data !== 'string') throw new Error(`data: ${data} should be a string`);
  return (data.match(headerRegex) || []).map( (header) => {
    return header.replace(headerRegex, '$1');
  });
}

export function getPathes(resolvedGraph) {
  if (!resolvedGraph) throw Error('resolvedGraph should be defined');
  return resolvedGraph.map( (item) => {
    return item.id;
  });
}

export function getData(resolvedGraph) {
  if (!resolvedGraph) throw new Error('resolved graph should be defined');
  return resolvedGraph.map(function (item) {
    return item.params.content;
  });
}

