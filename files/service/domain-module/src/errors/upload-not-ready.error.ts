import { DomainError } from '@atls/core-errors'

export class UploadNotReadyError extends DomainError {
  constructor() {
    super('Upload not ready')
  }
}
