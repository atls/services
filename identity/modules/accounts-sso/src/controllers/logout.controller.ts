import { Controller, Get } from '@nestjs/common'
import { Redirect }        from '@nestjs/common'
import { Query }           from '@nestjs/common'

import { HydraAdminApi }   from '@atls/nestjs-hydra'

@Controller('/oauth/logout')
export class LogoutController {
  constructor(private readonly hydra: HydraAdminApi) {}

  @Get()
  @Redirect('/auth/login')
  async logout(@Query('logout_challenge') challenge?: string) {
    if (challenge) {
      const { data: body } = await this.hydra.acceptLogoutRequest(challenge)

      return {
        url: `/auth/logout?return_to=${body.redirect_to}`,
      }
    }

    return undefined
  }
}
