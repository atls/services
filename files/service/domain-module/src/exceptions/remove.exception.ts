import { InternalServerErrorException } from '@nestjs/common'

export class RemoveException extends InternalServerErrorException {
  constructor(entity: string, payload: object, error: unknown) {
    const payloadText = JSON.stringify(payload, undefined, 2)

    let message = `Error on removing ${entity} in database with payload: ${payloadText}`

    if (error instanceof Error) {
      message = `${message} due to: ${error.message}`
    }

    super(message)
  }
}
