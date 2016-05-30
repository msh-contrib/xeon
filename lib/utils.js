'use strict';

import { platform } from 'os';
import { isAbsolute, resolve } from 'path';
import shebangRegex from 'shebang-regex';

//regex for matching source headers
export const headerRegex = /require\("(.*?)"\)/g;

//end of line
export const EOL = (!platform || platform() !== 'win32') ? '\n' : '\r\n';

export const correctShebang = '#!/usr/bin/env bash';

//replace shebang
export function replaceShebang(data) {
  return data.replace(shebangRegex, '');
};

export function toCorrectString(obj) {
  return ({}).toString.call(obj);
};

export function isObject(value) {
  return ( (typeof value === 'object') && (toCorrectString(value) === '[object Object]') );
};

export function hasProperty(obj, prop) {
  return ({}).hasOwnProperty.call(obj, prop);
};

export function beginsWith(target, str) {
  return target.slice(0, str.length) === str;
};

export function resolvePath(file) {
  return isAbsolute(file) ? file : resolve(process.cwd(), file);
}
