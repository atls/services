import { InternalServerErrorException } from '@nestjs/common'

export class CommandException extends InternalServerErrorException {
  constructor(commandName: string, payload: object, error: unknown) {
    const payloadText = JSON.stringify(payload, undefined, 2)

    let message = `Error execute command ${commandName} with payload: ${payloadText}`

    if (error instanceof Error) {
      message = `${message} due to: ${error.message}`
    }

    super(message)
  }
}
