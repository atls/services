import { NotFoundException as CommonNotFoundException } from '@nestjs/common'

export class NotFoundException extends CommonNotFoundException {
  constructor(item: string, payload: object, error?: unknown) {
    const payloadText = JSON.stringify(payload, undefined, 2)

    let message = `Error on finding ${item} with payload: ${payloadText}`

    if (error instanceof Error) {
      message = `${message} due to: ${error.message}`
    }

    super(message)
  }
}
