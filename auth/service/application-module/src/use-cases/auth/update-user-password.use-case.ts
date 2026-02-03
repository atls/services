import { Inject }                    from '@nestjs/common'
import { Logger }                    from '@nestjs/common'

import { UpdateUserPasswordCommand } from '../../commands/index.js'
import { AUTH_SETTINGS_PORT }        from '../../constants/index.js'
import { AuthSettingsPort }          from '../../ports/auth/index.js'

export class UpdateUserPasswordUseCase {
  private readonly logger = new Logger(UpdateUserPasswordUseCase.name)

  constructor(@Inject(AUTH_SETTINGS_PORT) private readonly authPort: AuthSettingsPort) {}

  async execute(command: UpdateUserPasswordCommand): Promise<void> {
    try {
      await this.authPort.updatePassword(command.password, command.sessionToken)
    } catch (error) {
      this.logger.error(`Error executing ${UpdateUserPasswordUseCase.name}`)
      throw error
    }
  }
}
