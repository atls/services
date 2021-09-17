import { Controller, Get } from '@nestjs/common'
import { Redirect }        from '@nestjs/common'
import { Query }           from '@nestjs/common'

import { Whoami, Session } from '@atls/nestjs-kratos'
import { HydraAdminApi }   from '@atls/nestjs-hydra'

@Controller('/oauth/consent')
export class ConsentController {
  constructor(private readonly hydra: HydraAdminApi) {}

  @Get()
  @Redirect('/auth/login')
  async consent(@Query('consent_challenge') challenge?: string, @Whoami() session?: Session) {
    if (challenge) {
      const { data: body } = await this.hydra.getConsentRequest(challenge)

      const { data: acceptBody } = await this.hydra.acceptConsentRequest(challenge, {
        grant_access_token_audience: body.requested_access_token_audience,
        grant_scope: body.requested_scope,
        remember_for: 3600,
        remember: true,
        session: {
          access_token: {
            ...(body.context || {}),
            ...(session?.identity || {}),
          },
          id_token: {
            // @ts-ignore
            email: session?.identity?.traits?.email,
          },
        },
      })

      return {
        url: acceptBody.redirect_to,
      }
    }

    return undefined
  }
}
