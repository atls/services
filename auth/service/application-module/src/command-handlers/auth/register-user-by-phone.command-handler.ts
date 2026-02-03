import type { ICommandHandler }       from '@nestjs/cqrs'

import { Logger }                     from '@nestjs/common'
import { CommandHandler }             from '@nestjs/cqrs'

import { RegisterUserByPhoneCommand } from '../../commands/index.js'
import { AuthRegistrationResponse }   from '../../ports/index.js'
import { RegisterUserByPhoneUseCase } from '../../use-cases/index.js'

@CommandHandler(RegisterUserByPhoneCommand)
export class RegisterUserByPhoneCommandHandler
  implements ICommandHandler<RegisterUserByPhoneCommand, AuthRegistrationResponse>
{
  private readonly logger = new Logger(RegisterUserByPhoneCommandHandler.name)

  constructor(private readonly registerUserByPhoneUseCase: RegisterUserByPhoneUseCase) {}

  async execute(command: RegisterUserByPhoneCommand): Promise<AuthRegistrationResponse> {
    try {
      return this.registerUserByPhoneUseCase.execute(command)
    } catch (error) {
      this.logger.error(`Error executing ${RegisterUserByPhoneCommand.name}`)
      throw error
    }
  }
}
