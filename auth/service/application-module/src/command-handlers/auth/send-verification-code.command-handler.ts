import type { AuthProcess }            from '@auth/domain-module'
import type { ICommandHandler }        from '@nestjs/cqrs'

import { Logger }                      from '@nestjs/common'
import { CommandHandler }              from '@nestjs/cqrs'

import { SendVerificationCodeCommand } from '../../commands/index.js'
import { SendVerificationCodeUseCase } from '../../use-cases/index.js'

@CommandHandler(SendVerificationCodeCommand)
export class SendVerificationCodeCommandHandler
  implements ICommandHandler<SendVerificationCodeCommand, AuthProcess>
{
  private readonly logger = new Logger(SendVerificationCodeCommandHandler.name)

  constructor(private readonly useCase: SendVerificationCodeUseCase) {}

  async execute(command: SendVerificationCodeCommand): Promise<AuthProcess> {
    try {
      return this.useCase.execute(command)
    } catch (error) {
      this.logger.error(`Error executing ${SendVerificationCodeCommand.name}`)
      throw error
    }
  }
}
