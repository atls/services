import { Inject }                     from '@nestjs/common'
import { Logger }                     from '@nestjs/common'

import { RegisterUserByEmailCommand } from '../../commands/index.js'
import { AUTH_REGISTRATION_PORT }     from '../../constants/index.js'
import { AuthRegistrationPort }       from '../../ports/index.js'
import { AuthRegistrationResponse }   from '../../ports/index.js'

export class RegisterUserByEmailUseCase {
  private readonly logger = new Logger(RegisterUserByEmailUseCase.name)

  constructor(@Inject(AUTH_REGISTRATION_PORT) private readonly authPort: AuthRegistrationPort) {}

  async execute(command: RegisterUserByEmailCommand): Promise<AuthRegistrationResponse> {
    try {
      return this.authPort.registerByEmail(command.email, command.password)
    } catch (error) {
      this.logger.error(`Error executing ${RegisterUserByEmailUseCase.name}`)
      throw error
    }
  }
}
