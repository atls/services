import type { UserSession }        from '@auth/domain-module'
import type { ICommandHandler }    from '@nestjs/cqrs'

import { Logger }                  from '@nestjs/common'
import { CommandHandler }          from '@nestjs/cqrs'

import { LoginUserByEmailCommand } from '../../commands/index.js'
import { LoginUserByEmailUseCase } from '../../use-cases/index.js'

@CommandHandler(LoginUserByEmailCommand)
export class LoginUserByEmailCommandHandler
  implements ICommandHandler<LoginUserByEmailCommand, UserSession>
{
  private readonly logger = new Logger(LoginUserByEmailCommandHandler.name)

  constructor(private readonly useCase: LoginUserByEmailUseCase) {}

  async execute(command: LoginUserByEmailCommand): Promise<UserSession> {
    try {
      return this.useCase.execute(command)
    } catch (error) {
      this.logger.error(`Error executing ${LoginUserByEmailCommand.name}`)
      throw error
    }
  }
}
