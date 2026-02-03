import type { AuthProcess }       from '@auth/domain-module'

import { Inject }                 from '@nestjs/common'
import { Logger }                 from '@nestjs/common'

import { UpdateUserEmailCommand } from '../../commands/index.js'
import { AUTH_SETTINGS_PORT }     from '../../constants/index.js'
import { AuthSettingsPort }       from '../../ports/auth/index.js'

export class UpdateUserEmailUseCase {
  private readonly logger = new Logger(UpdateUserEmailUseCase.name)

  constructor(@Inject(AUTH_SETTINGS_PORT) private readonly authPort: AuthSettingsPort) {}

  async execute(command: UpdateUserEmailCommand): Promise<AuthProcess> {
    try {
      return this.authPort.updateEmail(command.email, command.sessionToken)
    } catch (error) {
      this.logger.error(`Error executing ${UpdateUserEmailUseCase.name}`)
      throw error
    }
  }
}
