import type { AuthPhone } from '../../types/index.js'

export class LoginUserByPhoneCommand {
  constructor(public readonly phone: AuthPhone) {}
}
