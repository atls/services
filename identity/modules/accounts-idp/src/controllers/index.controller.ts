import { Controller, Get } from '@nestjs/common'
import { Redirect }        from '@nestjs/common'
import { Headers }         from '@nestjs/common'

import { Whoami, Session } from '@atls/nestjs-kratos'

@Controller('/')
export class IndexController {
  @Get()
  @Redirect('auth/login')
  async index(
    @Whoami() session: Session,
    @Headers('host') host: string,
    @Headers('x-forwarded-proto') forwardedProto: string
  ) {
    if (session) {
      if (forwardedProto === 'https' && host && host.startsWith('accounts.')) {
        return {
          url: `https://${host.replace('accounts.', '')}`,
        }
      }

      return {
        url: '/auth/session/whoami',
      }
    }

    return undefined
  }
}
