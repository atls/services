import { Inject }                  from '@nestjs/common'
import { Logger }                  from '@nestjs/common'

import { UserSession }             from '@auth/domain-module'

import { ConfirmLoginCodeCommand } from '../../commands/index.js'
import { AUTH_LOGIN_PORT }         from '../../constants/index.js'
import { AuthLoginPort }           from '../../ports/auth/index.js'

export class ConfirmLoginCodeUseCase {
  private readonly logger = new Logger(ConfirmLoginCodeUseCase.name)

  constructor(@Inject(AUTH_LOGIN_PORT) private readonly authPort: AuthLoginPort) {}

  async execute(command: ConfirmLoginCodeCommand): Promise<UserSession> {
    try {
      return this.authPort.confirmLoginCode(command.code, command.identifier, command.authProcess)
    } catch (error) {
      this.logger.error(`Error executing ${ConfirmLoginCodeUseCase.name}`)
      throw error
    }
  }
}
