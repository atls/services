import type { AuthProcess }        from '@auth/domain-module'
import type { ICommandHandler }    from '@nestjs/cqrs'

import { Logger }                  from '@nestjs/common'
import { CommandHandler }          from '@nestjs/cqrs'

import { LoginUserByPhoneCommand } from '../../commands/index.js'
import { LoginUserByPhoneUseCase } from '../../use-cases/index.js'

@CommandHandler(LoginUserByPhoneCommand)
export class LoginUserByPhoneCommandHandler
  implements ICommandHandler<LoginUserByPhoneCommand, AuthProcess>
{
  private readonly logger = new Logger(LoginUserByPhoneCommandHandler.name)

  constructor(private readonly useCase: LoginUserByPhoneUseCase) {}

  async execute(command: LoginUserByPhoneCommand): Promise<AuthProcess> {
    try {
      return this.useCase.execute(command)
    } catch (error) {
      this.logger.error(`Error executing ${LoginUserByPhoneCommand.name}`)
      throw error
    }
  }
}
