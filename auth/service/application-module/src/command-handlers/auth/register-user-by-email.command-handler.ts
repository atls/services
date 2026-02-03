import type { ICommandHandler }       from '@nestjs/cqrs'

import { Logger }                     from '@nestjs/common'
import { CommandHandler }             from '@nestjs/cqrs'

import { RegisterUserByEmailCommand } from '../../commands/index.js'
import { AuthRegistrationResponse }   from '../../ports/index.js'
import { RegisterUserByEmailUseCase } from '../../use-cases/index.js'

@CommandHandler(RegisterUserByEmailCommand)
export class RegisterUserByEmailCommandHandler
  implements ICommandHandler<RegisterUserByEmailCommand, AuthRegistrationResponse>
{
  private readonly logger = new Logger(RegisterUserByEmailCommandHandler.name)

  constructor(private readonly registerUserByEmailUseCase: RegisterUserByEmailUseCase) {}

  async execute(command: RegisterUserByEmailCommand): Promise<AuthRegistrationResponse> {
    try {
      return this.registerUserByEmailUseCase.execute(command)
    } catch (error) {
      this.logger.error(`Error executing ${RegisterUserByEmailCommand.name}`)
      throw error
    }
  }
}
