import type { AuthSsoLoginResponse }  from '../../ports/auth/index.js'
import type { AuthSsoPort }           from '../../ports/auth/index.js'

import { Inject }                     from '@nestjs/common'
import { Logger }                     from '@nestjs/common'

import { LoginUserByProviderCommand } from '../../commands/index.js'
import { AUTH_SSO_PORT }              from '../../constants/index.js'

export class LoginUserByProviderUseCase {
  private readonly logger = new Logger(LoginUserByProviderUseCase.name)

  constructor(@Inject(AUTH_SSO_PORT) private readonly authPort: AuthSsoPort) {}

  async execute(command: LoginUserByProviderCommand): Promise<AuthSsoLoginResponse> {
    try {
      return this.authPort.loginByProvider(command.provider, command.idToken, command.nonce)
    } catch (error) {
      this.logger.error(`Error executing ${LoginUserByProviderUseCase.name}`)
      throw error
    }
  }
}
