import type { ICommandHandler }       from '@nestjs/cqrs'

import type { AuthSsoLoginResponse }  from '../../ports/index.js'

import { Logger }                     from '@nestjs/common'
import { CommandHandler }             from '@nestjs/cqrs'

import { LoginUserByProviderCommand } from '../../commands/index.js'
import { LoginUserByProviderUseCase } from '../../use-cases/index.js'

@CommandHandler(LoginUserByProviderCommand)
export class LoginUserByProviderCommandHandler
  implements ICommandHandler<LoginUserByProviderCommand, AuthSsoLoginResponse>
{
  private readonly logger = new Logger(LoginUserByProviderCommandHandler.name)

  constructor(private readonly useCase: LoginUserByProviderUseCase) {}

  async execute(command: LoginUserByProviderCommand): Promise<AuthSsoLoginResponse> {
    try {
      return this.useCase.execute(command)
    } catch (error) {
      this.logger.error(`Error executing ${LoginUserByProviderCommand.name}`)
      throw error
    }
  }
}
