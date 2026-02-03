import type { AuthProcess }       from '@auth/domain-module'
import type { ICommandHandler }   from '@nestjs/cqrs'

import { Logger }                 from '@nestjs/common'
import { CommandHandler }         from '@nestjs/cqrs'

import { UpdateUserEmailCommand } from '../../commands/index.js'
import { UpdateUserEmailUseCase } from '../../use-cases/index.js'

@CommandHandler(UpdateUserEmailCommand)
export class UpdateUserEmailCommandHandler
  implements ICommandHandler<UpdateUserEmailCommand, AuthProcess>
{
  private readonly logger = new Logger(UpdateUserEmailCommandHandler.name)

  constructor(private readonly useCase: UpdateUserEmailUseCase) {}

  async execute(command: UpdateUserEmailCommand): Promise<AuthProcess> {
    try {
      return this.useCase.execute(command)
    } catch (error) {
      this.logger.error(`Error executing ${UpdateUserEmailCommand.name}`)
      throw error
    }
  }
}
