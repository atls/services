import { InternalServerErrorException } from '@nestjs/common'

export class SaveException extends InternalServerErrorException {
  constructor(entity: string, payload: object, error: unknown) {
    const payloadText = JSON.stringify(payload, undefined, 2)

    let message = `Error on saving ${entity} in database with payload: ${payloadText}`

    if (error instanceof Error) {
      message = `${message} due to: ${error.message}`
    }

    super(message)
  }
}
