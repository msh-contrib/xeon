// const path = require('path')
// const fs = require('fs')
// const trim = require('trim')
// const Graph = require('./graph')
// const urlRegex = require('url-regex')
// const utils = require('./utils')
// const request = require('sync-request')
// const file = require('./file-utils')
// const Promise = require('bluebird')
// const coroutine = Promise.coroutine
// const bashParser = require('bash-parser')


const stat = Promise.promisify(fs.stat)
/**
 * Aliases
 */
const beginsWith = utils.beginsWith
const headerRegex = utils.headerRegex

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

  var ast = bashParser(data, { mode: 'posix' })

  graph.addNode(normalizedPath || filePath, {
    content: trim(data.replace(headerRegex, '')),
    ast: ast
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

// module.exports = coroutine(function * (filePath, allowExternal) {
//   var graph = new Graph()

//   yield chunk(graph, filePath, null)

//   return graph
// })

async function chunkWorker(graph: Graph, filePath: string, parent: Node) {
  if (graph.getNode(filePath)) {
    return undefined
  }

  var normalizedPath = await resolveFilePath(filePath, parent)
  var data = (await readFile(normalizedPath)).toString()

  graph.addNode(normalizedPath || filePath, {
    content: data.replace(headerRegex, ''),
  })

  var required = await file.parseHeader(data)

  if (parent) {
    graph.addEdge(parent, normalizedPath || filePath)
  }

  if (required.length) {
    var tasks = []
    for (var i = 0; i < required.length; i++) {
      tasks.push(chunk(graph, required[i], normalizedPath))
    }

    await Promise.all(tasks)
  }
}
/**
 * Description
 */
export default async function (filePath: string, allowExternal: boolean) {
  let graph = new Graph()
  await processChunk(graph, filePath, null)
  return graph
}
