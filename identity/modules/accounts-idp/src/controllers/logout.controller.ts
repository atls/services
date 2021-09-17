import { Controller, Get }   from '@nestjs/common'
import { Redirect }          from '@nestjs/common'
import { Headers }           from '@nestjs/common'
import { Query }             from '@nestjs/common'
import { EventEmitter2 }     from '@nestjs/event-emitter'

import { Whoami, Session }   from '@atls/nestjs-kratos'
import { KratosBrowserUrls } from '@atls/nestjs-kratos'

@Controller('/auth/logout')
export class LogoutController {
  constructor(
    private readonly urls: KratosBrowserUrls,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Get()
  @Redirect('/')
  async logout(
    @Whoami() session: Session,
    @Query('return_to') returnTo: string,
    @Headers('host') host: string,
    @Headers('x-forwarded-proto') forwardedProto: string
  ) {
    if (session) {
      this.eventEmitter.emit('identity.logout.started', session)
    }

    return {
      url: this.urls.get('logout', {
        returnTo: this.urls.createInterceptingUrl(
          '/auth/logout/complete',
          forwardedProto,
          host,
          returnTo
        ),
      }),
    }
  }

  @Get('complete')
  @Redirect('/auth/login')
  complete(@Query('return_to') returnTo: string) {
    if (returnTo) {
      return {
        url: returnTo,
      }
    }

    return undefined
  }
}
