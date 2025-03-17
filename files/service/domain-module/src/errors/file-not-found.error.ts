import { DomainError } from '@atls/core-errors'

export class FileNotFoundError extends DomainError {
  constructor() {
    super('File not found')
  }
}
