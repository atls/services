import type { UserSession }        from '@auth/domain-module'

import { Inject }                  from '@nestjs/common'
import { Logger }                  from '@nestjs/common'

import { LoginUserByEmailCommand } from '../../commands/index.js'
import { AUTH_LOGIN_PORT }         from '../../constants/index.js'
import { AuthLoginPort }           from '../../ports/auth/index.js'

export class LoginUserByEmailUseCase {
  private readonly logger = new Logger(LoginUserByEmailUseCase.name)

  constructor(@Inject(AUTH_LOGIN_PORT) private readonly authPort: AuthLoginPort) {}

  async execute(command: LoginUserByEmailCommand): Promise<UserSession> {
    try {
      return this.authPort.loginByEmail(command.email, command.password, command.authProcess)
    } catch (error) {
      this.logger.error(`Error executing ${LoginUserByEmailUseCase.name}`)
      throw error
    }
  }
}
