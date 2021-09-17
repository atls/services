import { Response }                  from 'express'
import { Controller }                from '@nestjs/common'
import { Get, Res }                  from '@nestjs/common'
import { Redirect }                  from '@nestjs/common'
import { Query }                     from '@nestjs/common'
import { UseInterceptors }           from '@nestjs/common'
import { EventEmitter2 }             from '@nestjs/event-emitter'
import { KratosRedirectInterceptor } from '@atls/nestjs-kratos'
import { KratosAdminApi }            from '@atls/nestjs-kratos'
import { methodConfig }              from '@atls/nestjs-kratos'
import { Whoami, Session }           from '@atls/nestjs-kratos'
import { Flow }                      from '@atls/nestjs-kratos'

@Controller('profile/settings')
export class SettingsController {
  constructor(
    private readonly kratos: KratosAdminApi,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Get()
  @UseInterceptors(new KratosRedirectInterceptor('settings'))
  async settings(@Res() res: Response, @Flow() flow: string) {
    // TODO: check auth

    const { data } = await this.kratos.getSelfServiceSettingsFlow(flow)

    // eslint-disable-next-line
    console.dir(
      {
        ...data,
        password: methodConfig(data, 'password'),
        profile: methodConfig(data, 'profile'),
        oidc: methodConfig(data, 'oidc'),
      },
      { depth: null }
    )

    if (data.request_url.includes('/recovery/')) {
      if (data.state === 'success') {
        return res.redirect('/')
      }

      return res.render('profile/recovery', {
        ...data,
        password: methodConfig(data, 'password'),
        oidc: methodConfig(data, 'oidc'),
      })
    }

    return res.render('profile/settings', {
      ...data,
      password: methodConfig(data, 'password'),
      profile: methodConfig(data, 'profile'),
      oidc: methodConfig(data, 'oidc'),
    })
  }

  @Get('complete')
  @Redirect('/profile/settings')
  complete(@Whoami() session: Session, @Query('return_to') returnTo: string) {
    if (session) {
      this.eventEmitter.emit('identity.settings.update.complete', session)
    }

    if (returnTo) {
      return {
        url: returnTo,
      }
    }

    return undefined
  }
}
