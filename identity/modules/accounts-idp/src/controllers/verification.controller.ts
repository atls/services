import { Controller, Get }                     from '@nestjs/common'
import { Render, UseInterceptors }             from '@nestjs/common'
import { Redirect }                            from '@nestjs/common'
import { Query }                               from '@nestjs/common'
import { EventEmitter2 }                       from '@nestjs/event-emitter'

import { KratosRedirectInterceptor }           from '@atls/nestjs-kratos'
import { Flow, KratosPublicApi, methodConfig } from '@atls/nestjs-kratos'
import { Whoami, Session }                     from '@atls/nestjs-kratos'

@Controller('/auth/verification')
export class VerificationController {
  constructor(
    private readonly kratos: KratosPublicApi,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Get()
  @Render('auth/verification')
  @UseInterceptors(new KratosRedirectInterceptor('verification'))
  async verification(@Flow() flow: string) {
    const { data } = await this.kratos.getSelfServiceVerificationFlow(flow)

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
      this.eventEmitter.emit('identity.verification.complete', session)
    }

    if (returnTo) {
      return {
        url: returnTo,
      }
    }

    return undefined
  }
}
