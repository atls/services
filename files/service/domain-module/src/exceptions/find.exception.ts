import { NotFoundException } from '@nestjs/common'

export class FindException extends NotFoundException {
  constructor(entity: string, payload: object, error: unknown) {
    const payloadText = JSON.stringify(payload, undefined, 2)

    let message = `Error on finding ${entity} in database with payload: ${payloadText}`

    if (error instanceof Error) {
      message = `${message} due to: ${error.message}`
    }

    super(message)
  }
}
