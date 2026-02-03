import { Logger } from '@nestjs/common'

export class StrapiApiException extends Error {
  private readonly logger = new Logger(StrapiApiException.name)

  constructor(
    public scope: string,
    public payload: Record<string, unknown>,
    error: unknown
  ) {
    const payloadText = JSON.stringify(payload)

    super(`Failed to ${scope} with payload: ${payloadText}`, { cause: error })

    this.logger.warn(this.message)

    this.name = StrapiApiException.name
  }
}
