import type { AuthProcess }            from '@auth/domain-module'

import { Inject }                      from '@nestjs/common'
import { Logger }                      from '@nestjs/common'

import { SendVerificationCodeCommand } from '../../commands/index.js'
import { AUTH_VERIFICATION_PORT }      from '../../constants/index.js'
import { AuthVerificationPort }        from '../../ports/auth/index.js'

export class SendVerificationCodeUseCase {
  private readonly logger = new Logger(SendVerificationCodeUseCase.name)

  constructor(@Inject(AUTH_VERIFICATION_PORT) private readonly authPort: AuthVerificationPort) {}

  async execute(command: SendVerificationCodeCommand): Promise<AuthProcess> {
    try {
      return this.authPort.sendVerificationCode(command.email)
    } catch (error) {
      this.logger.error(`Error executing ${SendVerificationCodeUseCase.name}`)
      throw error
    }
  }
}
