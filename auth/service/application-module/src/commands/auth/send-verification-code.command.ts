import type { AuthEmail } from '../../types/index.js'

export class SendVerificationCodeCommand {
  constructor(public readonly email: AuthEmail) {}
}
