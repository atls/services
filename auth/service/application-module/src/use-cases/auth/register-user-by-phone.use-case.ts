import { randomBytes }                from 'node:crypto'

import { Inject }                     from '@nestjs/common'
import { Logger }                     from '@nestjs/common'

import { RegisterUserByPhoneCommand } from '../../commands/index.js'
import { AUTH_REGISTRATION_PORT }     from '../../constants/index.js'
import { AuthRegistrationPort }       from '../../ports/index.js'
import { AuthRegistrationResponse }   from '../../ports/index.js'

export class RegisterUserByPhoneUseCase {
  private readonly logger = new Logger(RegisterUserByPhoneUseCase.name)

  constructor(@Inject(AUTH_REGISTRATION_PORT) private readonly authPort: AuthRegistrationPort) {}

  async execute(command: RegisterUserByPhoneCommand): Promise<AuthRegistrationResponse> {
    try {
      const password = randomBytes(12).toString('hex')
      return this.authPort.registerByPhone(command.phone, password)
    } catch (error) {
      this.logger.error(`Error executing ${RegisterUserByPhoneUseCase.name}`)
      throw error
    }
  }
}
