import { DomainError } from '@atls/core-errors'

export class UknownFileTypeError extends DomainError {
  constructor() {
    super('Uknown file type', 'files.uknown-file-type')
  }
}
