import type { AuthProcess }    from '@auth/domain-module'

import type { AuthCode }       from '../../types/index.js'
import type { AuthIdentifier } from '../../types/index.js'

export class ConfirmLoginCodeCommand {
  constructor(
    public readonly authProcess: AuthProcess,
    public readonly code: AuthCode,
    public readonly identifier: AuthIdentifier
  ) {}
}
