import { Controller, Get } from '@nestjs/common'

import { Whoami, Session } from '@atls/nestjs-kratos'

@Controller('/auth/session')
export class SessionController {
  @Get('whoami')
  async whoami(@Whoami() session: Session) {
    return session
  }
}
