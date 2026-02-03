import type { ICommandHandler }    from '@nestjs/cqrs'

import { Logger }                  from '@nestjs/common'
import { CommandHandler }          from '@nestjs/cqrs'

import { UserSession }             from '@auth/domain-module'

import { ConfirmLoginCodeCommand } from '../../commands/index.js'
import { ConfirmLoginCodeUseCase } from '../../use-cases/index.js'

@CommandHandler(ConfirmLoginCodeCommand)
export class ConfirmLoginCodeCommandHandler
  implements ICommandHandler<ConfirmLoginCodeCommand, UserSession>
{
  private readonly logger = new Logger(ConfirmLoginCodeCommandHandler.name)

  constructor(private readonly useCase: ConfirmLoginCodeUseCase) {}

  async execute(command: ConfirmLoginCodeCommand): Promise<UserSession> {
    try {
      return this.useCase.execute(command)
    } catch (error) {
      this.logger.error(`Error executing ${ConfirmLoginCodeCommand.name}`)
      throw error
    }
  }
}
