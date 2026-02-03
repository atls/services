import type { ICommandHandler }           from '@nestjs/cqrs'

import { Logger }                         from '@nestjs/common'
import { CommandHandler }                 from '@nestjs/cqrs'

import { ConfirmVerificationCodeCommand } from '../../commands/index.js'
import { ConfirmVerificationCodeUseCase } from '../../use-cases/index.js'

@CommandHandler(ConfirmVerificationCodeCommand)
export class ConfirmVerificationCodeCommandHandler
  implements ICommandHandler<ConfirmVerificationCodeCommand, void>
{
  private readonly logger = new Logger(ConfirmVerificationCodeCommandHandler.name)

  constructor(private readonly useCase: ConfirmVerificationCodeUseCase) {}

  async execute(command: ConfirmVerificationCodeCommand): Promise<void> {
    try {
      await this.useCase.execute(command)
    } catch (error) {
      this.logger.error(`Error executing ${ConfirmVerificationCodeCommand.name}`)
      throw error
    }
  }
}
