import { Inject }                         from '@nestjs/common'
import { Logger }                         from '@nestjs/common'

import { ConfirmVerificationCodeCommand } from '../../commands/index.js'
import { AUTH_VERIFICATION_PORT }         from '../../constants/index.js'
import { AuthVerificationPort }           from '../../ports/auth/index.js'

export class ConfirmVerificationCodeUseCase {
  private readonly logger = new Logger(ConfirmVerificationCodeUseCase.name)

  constructor(@Inject(AUTH_VERIFICATION_PORT) private readonly authPort: AuthVerificationPort) {}

  async execute(command: ConfirmVerificationCodeCommand): Promise<void> {
    try {
      await this.authPort.confirmVerificationCode(command.code, command.authProcess)
    } catch (error) {
      this.logger.error(`Error executing ${ConfirmVerificationCodeUseCase.name}`)
      throw error
    }
  }
}
