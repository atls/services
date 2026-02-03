import type { AuthEmail } from '../../types/index.js'

export class SendRecoveryCodeCommand {
  constructor(public readonly email: AuthEmail) {}
}
