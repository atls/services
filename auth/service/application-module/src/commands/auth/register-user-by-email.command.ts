import type { AuthEmail }    from '../../types/index.js'
import type { AuthPassword } from '../../types/index.js'

export class RegisterUserByEmailCommand {
  constructor(
    public readonly email: AuthEmail,
    public readonly password: AuthPassword
  ) {}
}
