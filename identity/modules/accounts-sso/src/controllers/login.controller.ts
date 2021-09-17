import { Controller, Get }          from '@nestjs/common'
import { Redirect }                 from '@nestjs/common'
import { Query }                    from '@nestjs/common'
import { EventEmitter2 }            from '@nestjs/event-emitter'

import { Whoami, Session }          from '@atls/nestjs-kratos'
import { extractLoginRequestState } from '@atls/nestjs-hydra'
import { HydraAdminApi }            from '@atls/nestjs-hydra'

@Controller('/oauth/login')
export class LoginController {
  constructor(
    private readonly hydra: HydraAdminApi,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Get()
  @Redirect('/auth/login')
  async login(@Whoami() session: Session, @Query('login_challenge') challenge?: string) {
    if (challenge) {
      if (session) {
        const { data: body } = await this.hydra.acceptLoginRequest(challenge, {
          subject: session.identity.id,
        })

        if (body && body.redirect_to) {
          return {
            url: body.redirect_to,
          }
        }
      } else {
        const { data: body } = await this.hydra.getLoginRequest(challenge)

        if (body.skip) {
          const { data: acceptBody } = await this.hydra.acceptLoginRequest(challenge, {
            subject: body.subject,
          })

          if (acceptBody && acceptBody.redirect_to) {
            return {
              url: acceptBody.redirect_to,
            }
          }
        } else {
          const state = extractLoginRequestState(body)
          const target = this.getRedirectTarget(state)

          return {
            url: `${target}?return_to=/oauth/login?login_challenge=${challenge}`,
          }
        }
      }
    }

    return undefined
  }

  getRedirectTarget(state: any) {
    if (state.target === 'registration') {
      return '/auth/registration'
    }

    if (state.target === 'verification') {
      return '/auth/verification'
    }

    if (state.target === 'recovery') {
      return '/auth/recovery'
    }

    if (state.target === 'settings') {
      return '/settings'
    }

    return '/auth/login'
  }
}
