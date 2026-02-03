import type { AuthProcess } from '@auth/domain-module'

import type { AuthCode }    from '../../types/index.js'

export class ConfirmRecoveryCodeCommand {
  constructor(
    public readonly authProcess: AuthProcess,
    public readonly code: AuthCode
  ) {}
}
