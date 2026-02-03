import type { UserSession }           from '@auth/domain-module'
import type { ICommandHandler }       from '@nestjs/cqrs'

import { Logger }                     from '@nestjs/common'
import { CommandHandler }             from '@nestjs/cqrs'

import { ConfirmRecoveryCodeCommand } from '../../commands/index.js'
import { ConfirmRecoveryCodeUseCase } from '../../use-cases/index.js'

@CommandHandler(ConfirmRecoveryCodeCommand)
export class ConfirmRecoveryCodeCommandHandler
  implements ICommandHandler<ConfirmRecoveryCodeCommand, UserSession>
{
  private readonly logger = new Logger(ConfirmRecoveryCodeCommandHandler.name)

  constructor(private readonly useCase: ConfirmRecoveryCodeUseCase) {}

  async execute(command: ConfirmRecoveryCodeCommand): Promise<UserSession> {
    try {
      return this.useCase.execute(command)
    } catch (error) {
      this.logger.error(`Error executing ${ConfirmRecoveryCodeCommand.name}`)
      throw error
    }
  }
}
