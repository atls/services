import type { ICommandHandler }     from '@nestjs/cqrs'

import { Logger }                   from '@nestjs/common'
import { CommandHandler }           from '@nestjs/cqrs'

import { DeleteUserAccountCommand } from '../../commands/index.js'
import { DeleteUserAccountUseCase } from '../../use-cases/index.js'

@CommandHandler(DeleteUserAccountCommand)
export class DeleteUserAccountCommandHandler
  implements ICommandHandler<DeleteUserAccountCommand, void>
{
  private readonly logger = new Logger(DeleteUserAccountCommandHandler.name)

  constructor(private readonly useCase: DeleteUserAccountUseCase) {}

  async execute(command: DeleteUserAccountCommand): Promise<void> {
    try {
      await this.useCase.execute(command)
    } catch (error) {
      this.logger.error(`Error executing ${DeleteUserAccountCommand.name}`)
      throw error
    }
  }
}
