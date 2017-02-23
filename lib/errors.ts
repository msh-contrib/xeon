export enum ErrorCodes {
  FsError,
  ConfigError,
  ValidationError
}

export class CustomError extends Error {
  code: ErrorCodes
  constructor(code: ErrorCodes, message: string) {
    super(message)
    this.code = code
  }
}
