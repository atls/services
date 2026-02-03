import type { ICommandHandler }      from '@nestjs/cqrs'

import { Logger }                    from '@nestjs/common'
import { CommandHandler }            from '@nestjs/cqrs'

import { UpdateUserPasswordCommand } from '../../commands/index.js'
import { UpdateUserPasswordUseCase } from '../../use-cases/index.js'

@CommandHandler(UpdateUserPasswordCommand)
export class UpdateUserPasswordCommandHandler
  implements ICommandHandler<UpdateUserPasswordCommand, void>
{
  private readonly logger = new Logger(UpdateUserPasswordCommandHandler.name)

  constructor(private readonly useCase: UpdateUserPasswordUseCase) {}

  async execute(command: UpdateUserPasswordCommand): Promise<void> {
    try {
      await this.useCase.execute(command)
    } catch (error) {
      this.logger.error(`Error executing ${UpdateUserPasswordCommand.name}`)
      throw error
    }
  }
}
