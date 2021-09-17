import { Controller, Get } from '@nestjs/common'
import { Render }          from '@nestjs/common'
import { Query }           from '@nestjs/common'
import { EventEmitter2 }   from '@nestjs/event-emitter'

import { KratosPublicApi } from '@atls/nestjs-kratos'

@Controller('/auth/error')
export class ErrorController {
  constructor(
    private readonly kratos: KratosPublicApi,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Get()
  @Render('auth/error')
  async error(@Query('error') error?: string) {
    if (error) {
      const { data } = await this.kratos.getSelfServiceError(error)

      if (data) {
        this.eventEmitter.emit('identity.auth.error', data)

        // eslint-disable-next-line
        console.log(data)

        return data
      }
    }

    return {}
  }
}
