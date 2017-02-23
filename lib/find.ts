import {readFile} from './file'
import {isAbsolute, extname, resolve, dirname} from 'path'
import {beginsWith} from './utils'

const usedShells = [
  'sh',
  'bash',
  'fish'
]

function addExtension(filePath: string) {
  const extension = extname(filePath)

  if (extension) {
    if (!usedShells.indexOf(extension.slice(1))) {
      throw new Error('Unsupported shell type')
    }

    return filePath
  }

  return filePath.concat('.sh')
}

function relativePath(filePath: string) {
  return beginsWith('./', filePath) || beginsWith('../', filePath)
}

export function getLocation(filePath, parent): string {
  if (!filePath) {
    throw new Error('filePath should be defined')
  } else if (typeof filePath !== 'string') {
    throw new Error('filePath should be a string')
  }

  if (isAbsolute(filePath)) return addExtension(filePath)

  if (relativePath(filePath)) {
    if (parent) {
      return addExtension(resolve(dirname(parent), filePath))
    } else {
      return addExtension(resolve(process.cwd(), filePath))
    }
  }

  // if not path just return a string as it is
  return filePath
}

