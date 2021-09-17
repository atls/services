import { Controller, Get }                     from '@nestjs/common'
import { Render, UseInterceptors }             from '@nestjs/common'
import { Redirect }                            from '@nestjs/common'
import { Query }                               from '@nestjs/common'
import { EventEmitter2 }                       from '@nestjs/event-emitter'

import { KratosRedirectInterceptor }           from '@atls/nestjs-kratos'
import { Flow, KratosPublicApi, methodConfig } from '@atls/nestjs-kratos'
import { Whoami, Session }                     from '@atls/nestjs-kratos'

@Controller('/auth/recovery')
export class RecoveryController {
  constructor(
    private readonly kratos: KratosPublicApi,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Get()
  @Render('auth/recovery')
  @UseInterceptors(new KratosRedirectInterceptor('recovery'))
  async recovery(@Flow() flow: string) {
    const { data } = await this.kratos.getSelfServiceRecoveryFlow(flow)

    // eslint-disable-next-line
    console.dir(data, { depth: null })

    return {
      ...data,
      link: methodConfig(data, 'link'),
    }
  }

  @Get('complete')
  @Redirect('/')
  complete(@Whoami() session: Session, @Query('return_to') returnTo: string) {
    if (session) {
      this.eventEmitter.emit('identity.recovery.complete', session)
    }

    if (returnTo) {
      return {
        url: returnTo,
      }
    }

    return undefined
  }
}
