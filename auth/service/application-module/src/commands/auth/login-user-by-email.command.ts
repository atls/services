import type { AuthProcess }  from '@auth/domain-module'

import type { AuthEmail }    from '../../types/index.js'
import type { AuthPassword } from '../../types/index.js'

export class LoginUserByEmailCommand {
  constructor(
    public readonly email: AuthEmail,
    public readonly password: AuthPassword,
    public readonly authProcess?: AuthProcess
  ) {}
}
