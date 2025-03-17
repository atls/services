import { DomainError } from '@atls/core-errors'

export class InvalidContentSizeError extends DomainError {
  constructor(received: number, range: { min: number; max: number }) {
    super(
      `File size must be greater than ${range.min} and less than ${range.max}, current size is ${received}`
    )
  }
}
