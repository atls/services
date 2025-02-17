import { InternalServerErrorException } from '@nestjs/common'

export class QueryException extends InternalServerErrorException {
  constructor(queryName: string, payload: object, error: unknown) {
    const payloadText = JSON.stringify(payload, undefined, 2)

    let message = `Error execute query ${queryName} with payload: ${payloadText}`

    if (error instanceof Error) {
      message = `${message} due to: ${error.message}`
    }

    super(message)
  }
}
