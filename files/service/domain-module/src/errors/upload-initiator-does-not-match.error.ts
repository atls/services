import { DomainError } from '@atls/core-errors'

export class UploadInitiatorDoesNotMatch extends DomainError {
  constructor() {
    super('Upload initiator does not match')
  }
}
