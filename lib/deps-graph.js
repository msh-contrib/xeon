const path = require('path')
const fs = require('fs')
const trim = require('trim')
const Graph = require('./graph')
const urlRegex = require('url-regex')
const utils = require('./utils')
const request = require('sync-request')
const file = require('./file')
const Promise = require('bluebird')
const coroutine = Promise.coroutine

const stat = Promise.promisify(fs.stat)
/**
 * Aliases
 */
const beginsWith = utils.beginsWith
const headerRegex = utils.headerRegex


// // find module location
// function makeModuleLookup(moduleName) {
//   let nodeModulesPath = path.join(process.cwd(), 'node_modules', moduleName);
//   if (fs.statSync(nodeModulesPath).isDirectory()) {
//    return nodeModulesPath;
//   } else {
//     throw new Error(`Could not find ${modulePath}`);
//   }
// }

// // return resolved string for file path
// function resolveFilePath(file, parent) {
//   if (!file || typeof file !== 'string') throw new Error('file should be a string');

//   if (relativePath(file) && parent) {
//     return path.resolve(path.dirname(parent), file);
//   }

//   if (relativePath(file) && !parent) {
//     return path.resolve(process.cwd(), file);
//   }

//   if (path.isAbsolute(file)) return file;

//   let modulePath = makeModuleLookup(file);
//   if (!modulePath) throw new Error('Can not find modules location');

//   let pkgFile = readDepsFile(modulePath);
//   let mainFile = getMainFile(pkgFile);

//   return path.resolve(modulePath, mainFile);
// }

// module.exports = (filePath, allowExternal) => {
//   // let graph = new Graph();

//   // (function walk(filePath, parent) {
//   //   // if graph already have such node skip
//   //   if (graph.getNode(filePath)) return;

//   //   let data = null, normalizedPath = null;

//   //   if (urlRegex({ exact: true }).test(filePath)) {
//   //     if (!allowExternal) throw new Error('external files not allowed');
//   //     try {
//   //       let response = request('GET', filePath);
//   //       if (response.statusCode !== 200)
//   //         throw new Error(`Error while loading file, code ${response.statusCode}`);
//   //       data = response.getBody('utf8');
//   //     } catch(error) {
//   //       throw new Error(`Error while loading file ${filePath}`);
//   //     }
//   //   } else {
//   //     normalizedPath = resolveFilePath(filePath, parent);
//   //     data = file.readFile(normalizedPath);
//   //   }

//   //   // add node if nece
//   //   graph.addNode(normalizedPath || filePath, {
//   //     content: trim(data.replace(headerRegex, ''))
//   //   });

//   //   // get required modules
//   //   let required = file.parseHeader(data);

//   //   // if parent exist add edge from it to child
//   //   if (parent) graph.addEdge(parent, normalizedPath || filePath);
//   //   // if no modules required break recusion
//   //   if (!required.length) return;

//   //   required.forEach( (path) => {
//   //     walk(path, normalizedPath);
//   //   });
//   // })(filePath);

//   // console.log(graph)
//   // return graph;

//   console.log(filePath)
//   console.log(file.readFile)
// }

/**
 * Check if string is relative path
 */
function relativePath(file) {
  return beginsWith(file, './') || beginsWith(file, '../');
}

/**
 * Get main file from package json
 */
function getMainFile(pkgFile) {
  if (!pkgFile) {
    throw new Error('deps file should be defined')
  }
  return pkgFile.main || './index.sh';
}

/**
 * Reading dependencies file
 */
const readDepsFile = coroutine(function * (moduleLocation) {
  var pkg = path.join(moduleLocation, './package.json')
  var fileStat = yield stat(pkg)

  if (!fileStat.isFile()) {
    throw new Error('Can not find package.json file')
  }

  return JSON.parse(yield file.readFile(pkg))
})

/**
 * Lookup module directory
 */
const makeModuleLookup = coroutine(function * (moduleName) {
  var modulesPath = path.join(process.cwd(), 'node_modules', moduleName)
  var fileStat = yield stat(modulesPath)

  if (!fileStat.isDirectory()) {
    throw new Error('Could not find module')
  }

  return modulesPath
})

/**
 * Resolve
 */
const resolveFilePath = coroutine(function * (file, parent) {
  if (!file || typeof file !== 'string') {
    return Promise.reject(new Error('file should be a string'))
  }

  if (relativePath(file) && parent) {
    return path.resolve(path.dirname(parent), file)
  }

  if (relativePath(file) && !parent) {
    return path.resolve(process.cwd(), file)
  }

  if (path.isAbsolute(file)) return file

  var modulePath = yield makeModuleLookup(file)
  if (!modulePath) {
    var error = new Error('Can not find modules location')
    return Promise.reject(error)
  }

  let pkgFile = yield readDepsFile(modulePath);
  let mainFile = getMainFile(pkgFile);

  return path.resolve(modulePath, mainFile)
})

/**
 * Processs single chunk
 */
const chunk = coroutine(function * (graph, filePath, parent) {
  if (graph.getNode(filePath)) {
    return undefined
  }

  var normalizedPath = yield resolveFilePath(filePath, parent)
  var data = (yield file.readFile(normalizedPath)).toString()

  graph.addNode(normalizedPath || filePath, {
    content: trim(data.replace(headerRegex, ''))
  })

  var required = yield file.parseHeader(data)

  if (parent) {
    graph.addEdge(parent, normalizedPath || filePath)
  }

  if (required.length) {
    var tasks = []
    for (var i = 0; i < required.length; i++) {
      tasks.push(chunk(graph, required[i], normalizedPath))
    }

    yield Promise.all(tasks)
  }
})

module.exports = coroutine(function * (filePath, allowExternal) {
  var graph = new Graph()

  yield chunk(graph, filePath, null)

  return graph
})
