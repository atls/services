import type { UserSession }           from '@auth/domain-module'

import { Inject }                     from '@nestjs/common'
import { Logger }                     from '@nestjs/common'

import { ConfirmRecoveryCodeCommand } from '../../commands/index.js'
import { AUTH_RECOVERY_PORT }         from '../../constants/index.js'
import { AuthRecoveryPort }           from '../../ports/index.js'

export class ConfirmRecoveryCodeUseCase {
  private readonly logger = new Logger(ConfirmRecoveryCodeUseCase.name)

  constructor(@Inject(AUTH_RECOVERY_PORT) private readonly authPort: AuthRecoveryPort) {}

  async execute(command: ConfirmRecoveryCodeCommand): Promise<UserSession> {
    try {
      return this.authPort.confirmRecoveryCode(command.code, command.authProcess)
    } catch (error) {
      this.logger.error(`Error executing ${ConfirmRecoveryCodeUseCase.name}`)
      throw error
    }
  }
}
