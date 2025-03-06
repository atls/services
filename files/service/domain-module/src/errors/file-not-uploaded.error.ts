import { DomainError } from '@atls/core-errors'

export class FileNotUploadedError extends DomainError {
  constructor() {
    super('File not uploaded', 'files.file-not-uploaded')
  }
}
