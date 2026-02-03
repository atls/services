import type { AuthEmail } from '../../types/index.js'
import type { AuthToken } from '../../types/index.js'

export class UpdateUserEmailCommand {
  constructor(
    public readonly email: AuthEmail,
    public readonly sessionToken: AuthToken
  ) {}
}
