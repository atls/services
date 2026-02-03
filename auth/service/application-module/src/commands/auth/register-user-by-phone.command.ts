import type { AuthPhone } from '../../types/index.js'

export class RegisterUserByPhoneCommand {
  constructor(public readonly phone: AuthPhone) {}
}
