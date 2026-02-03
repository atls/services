import type { AuthProcess }        from '@auth/domain-module'

import { Inject }                  from '@nestjs/common'
import { Logger }                  from '@nestjs/common'

import { LoginUserByPhoneCommand } from '../../commands/index.js'
import { AUTH_LOGIN_PORT }         from '../../constants/index.js'
import { AuthLoginPort }           from '../../ports/auth/index.js'

export class LoginUserByPhoneUseCase {
  private readonly logger = new Logger(LoginUserByPhoneUseCase.name)

  constructor(@Inject(AUTH_LOGIN_PORT) private readonly authPort: AuthLoginPort) {}

  async execute(command: LoginUserByPhoneCommand): Promise<AuthProcess> {
    try {
      return this.authPort.loginByPhone(command.phone)
    } catch (error) {
      this.logger.error(`Error executing ${LoginUserByPhoneUseCase.name}`)
      throw error
    }
  }
}
