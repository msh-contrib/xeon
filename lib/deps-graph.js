import path from 'path';
import fs from 'fs';
import trim from 'trim';
import Graph from './graph';
import urlRegex from 'url-regex';
import { beginsWith, headerRegex } from './utils';
import request from 'sync-request';
import * as file from './file';

// check if string is relative path
function relativePath(file) {
  return beginsWith(file, './') || beginsWith(file, '../');
}

// read deps file and get data
function readDepsFile(moduleLoc) {
  const pkg = path.join(moduleLoc, './package.json');
  if (!fs.statSync(pkg).isFile()) throw new Error('can not find package.json file');
  return JSON.parse(file.readFile(pkg));
}

// get main file from package json
function getMainFile(pkgFile) {
  if (!pkgFile) throw new Error('deps file should be defined');
  return pkgFile.main || './index.sh';
}

// find module location
function makeModuleLookup(moduleName) {
  let nodeModulesPath = path.join(process.cwd(), 'node_modules', moduleName);
  if (fs.statSync(nodeModulesPath).isDirectory()) {
   return nodeModulesPath;
  } else {
    throw new Error(`Could not find ${modulePath}`);
  }
}

// return resolved string for file path
function resolveFilePath(file, parent) {
  if (!file || typeof file !== 'string') throw new Error('file should be a string');

  if (relativePath(file) && parent) {
    return path.resolve(path.dirname(parent), file);
  }

  if (relativePath(file) && !parent) {
    return path.resolve(process.cwd(), file);
  }

  if (path.isAbsolute(file)) return file;

  let modulePath = makeModuleLookup(file);
  if (!modulePath) throw new Error('Can not find modules location');

  let pkgFile = readDepsFile(modulePath);
  let mainFile = getMainFile(pkgFile);

  return path.resolve(modulePath, mainFile);
}

export default (filePath, allowExternal) => {
  let graph = new Graph();

  (function walk(filePath, parent) {
    // if graph already have such node skip
    if (graph.getNode(filePath)) return;

    let data = null, normalizedPath = null;

    if (urlRegex({ exact: true }).test(filePath)) {
      if (!allowExternal) throw new Error('external files not allowed');
      try {
        let response = request('GET', filePath);
        if (response.statusCode !== 200)
          throw new Error(`Error while loading file, code ${response.statusCode}`);
        data = response.getBody('utf8');
      } catch(error) {
        throw new Error(`Error while loading file ${filePath}`);
      }
    } else {
      normalizedPath = resolveFilePath(filePath, parent);
      data = file.readFile(normalizedPath);
    }

    // add node if nece
    graph.addNode(normalizedPath || filePath, {
      content: trim(data.replace(headerRegex, ''))
    });

    // get required modules
    let required = file.parseHeader(data);

    // if parent exist add edge from it to child
    if (parent) graph.addEdge(parent, normalizedPath || filePath);
    // if no modules required break recusion
    if (!required.length) return;

    required.forEach( (path) => {
      walk(path, normalizedPath);
    });
  })(filePath);

  return graph;
}
