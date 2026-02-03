import type { AuthPassword } from '../../types/index.js'
import type { AuthToken }    from '../../types/index.js'

export class UpdateUserPasswordCommand {
  constructor(
    public readonly password: AuthPassword,
    public readonly sessionToken: AuthToken
  ) {}
}
