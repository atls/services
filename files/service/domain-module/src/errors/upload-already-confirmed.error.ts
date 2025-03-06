import { DomainError } from '@atls/core-errors'

export class UploadAlreadyConfirmedError extends DomainError {
  constructor() {
    super('Upload already confirmed', 'files.upload-already-confirmed')
  }
}
