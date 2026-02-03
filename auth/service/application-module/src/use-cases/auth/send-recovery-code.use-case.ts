import type { AuthProcess }        from '@auth/domain-module'

import { Inject }                  from '@nestjs/common'
import { Logger }                  from '@nestjs/common'

import { SendRecoveryCodeCommand } from '../../commands/index.js'
import { AUTH_RECOVERY_PORT }      from '../../constants/index.js'
import { AuthRecoveryPort }        from '../../ports/auth/index.js'

export class SendRecoveryCodeUseCase {
  private readonly logger = new Logger(SendRecoveryCodeUseCase.name)

  constructor(@Inject(AUTH_RECOVERY_PORT) private readonly authPort: AuthRecoveryPort) {}

  async execute(command: SendRecoveryCodeCommand): Promise<AuthProcess> {
    try {
      return this.authPort.sendRecoveryCode(command.email)
    } catch (error) {
      this.logger.error(`Error executing ${SendRecoveryCodeUseCase.name}`)
      throw error
    }
  }
}
