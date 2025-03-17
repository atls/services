import { DomainError } from '@atls/core-errors'

export class UnknownFileTypeError extends DomainError {
  constructor() {
    super('Unknown file type')
  }
}
