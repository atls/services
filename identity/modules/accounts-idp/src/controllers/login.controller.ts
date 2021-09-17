import { Controller, Get }                     from '@nestjs/common'
import { Render, UseInterceptors }             from '@nestjs/common'
import { Redirect }                            from '@nestjs/common'
import { Query }                               from '@nestjs/common'
import { EventEmitter2 }                       from '@nestjs/event-emitter'
import { KratosRedirectInterceptor }           from '@atls/nestjs-kratos'
import { Flow, KratosPublicApi, methodConfig } from '@atls/nestjs-kratos'
import { Whoami, Session }                     from '@atls/nestjs-kratos'

@Controller('/auth/login')
export class LoginController {
  constructor(
    private readonly kratos: KratosPublicApi,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Get()
  @Render('auth/login')
  @UseInterceptors(new KratosRedirectInterceptor('login'))
  async login(@Flow() flow: string) {
    const { data } = await this.kratos.getSelfServiceLoginFlow(flow)

    // eslint-disable-next-line
    console.dir(data, { depth: null })

    return {
      ...data,
      oidc: methodConfig(data, 'oidc'),
      password: methodConfig(data, 'password'),
    }
  }

  @Get('complete')
  @Redirect('/')
  complete(@Whoami() session: Session, @Query('return_to') returnTo: string) {
    if (session) {
      this.eventEmitter.emit('identity.login.complete', session)
    }

    if (returnTo) {
      return {
        url: returnTo,
      }
    }

    return undefined
  }
}
