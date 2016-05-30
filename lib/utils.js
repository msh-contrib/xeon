'use strict';

import {platform} from 'os';
import * as shebangRegex from 'shebangRegex';

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
  return ( (typeof value === 'object') && (this.toCorrectString(value) === '[object Object]') );
};

export function hasProperty(obj, prop) {
  return ({}).hasOwnProperty.call(obj, prop);
};

export function beginsWith(target, str) {
  return target.slice(0, str.length) === str;
};
