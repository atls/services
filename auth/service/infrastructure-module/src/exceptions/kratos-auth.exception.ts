import { Logger }       from '@nestjs/common'
import { isAxiosError } from 'axios'

export class KratosAuthException extends Error {
  private readonly logger = new Logger(KratosAuthException.name)

  constructor(
    public scope: string,
    public payload: Record<string, unknown>,
    error: unknown
  ) {
    const payloadText = JSON.stringify(payload)

    super(`Failed to ${scope} with payload: ${payloadText}.`, { cause: error })

    this.logger.warn(this.message)

    if (isAxiosError(error)) {
      this.logger.warn(error.response?.data)
    } else if (error instanceof Error) {
      this.logger.warn(error.message)
    }

    this.name = KratosAuthException.name
  }
}
