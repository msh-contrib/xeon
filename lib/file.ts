import {readFile as read, stat} from 'fs'
import {ErrorCodes, CustomError} from './errors'

function pStat(file: string): Promise<any> {
  return new Promise(function (resolve, reject) {
    stat(file, function(err, stats) {
      if (err) return reject(err)
      resolve(stats)
    })
  })
}

function pRead(file: string): Promise<any> {
  return new Promise(function (resolve, reject) {
    read(file, 'utf8', function (err, data) {
      if (err) return reject (err)
      resolve(data)
    })
  })
}

export async function readFile(file: string) {
  if (!(await pStat(file)).isFile()) {
    throw new CustomError(
      ErrorCodes.FsError,
      'No such file'
    )
  }

  return await pRead(file)
}
