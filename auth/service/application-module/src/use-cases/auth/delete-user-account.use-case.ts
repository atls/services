import { Inject }                   from '@nestjs/common'
import { Logger }                   from '@nestjs/common'

import { DeleteUserAccountCommand } from '../../commands/index.js'
import { AUTH_SETTINGS_PORT }       from '../../constants/index.js'
import { AuthSettingsPort }         from '../../ports/auth/index.js'

export class DeleteUserAccountUseCase {
  private readonly logger = new Logger(DeleteUserAccountUseCase.name)

  constructor(@Inject(AUTH_SETTINGS_PORT) private readonly authPort: AuthSettingsPort) {}

  async execute(command: DeleteUserAccountCommand): Promise<void> {
    try {
      await this.authPort.deleteAccount(command.accountId)
    } catch (error) {
      this.logger.error(`Error executing ${DeleteUserAccountUseCase.name}`)
      throw error
    }
  }
}
