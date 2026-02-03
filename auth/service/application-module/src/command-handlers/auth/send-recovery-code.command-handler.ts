import type { AuthProcess }        from '@auth/domain-module'
import type { ICommandHandler }    from '@nestjs/cqrs'

import { Logger }                  from '@nestjs/common'
import { CommandHandler }          from '@nestjs/cqrs'

import { SendRecoveryCodeCommand } from '../../commands/index.js'
import { SendRecoveryCodeUseCase } from '../../use-cases/index.js'

@CommandHandler(SendRecoveryCodeCommand)
export class SendRecoveryCodeCommandHandler
  implements ICommandHandler<SendRecoveryCodeCommand, AuthProcess>
{
  private readonly logger = new Logger(SendRecoveryCodeCommandHandler.name)

  constructor(private readonly useCase: SendRecoveryCodeUseCase) {}

  async execute(command: SendRecoveryCodeCommand): Promise<AuthProcess> {
    try {
      return this.useCase.execute(command)
    } catch (error) {
      this.logger.error(`Error executing ${SendRecoveryCodeCommand.name}`)
      throw error
    }
  }
}
