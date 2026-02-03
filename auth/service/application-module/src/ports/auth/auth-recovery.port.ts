import type { AuthProcess } from '@auth/domain-module'
import type { UserSession } from '@auth/domain-module'

import type { AuthCode }    from '../../types/index.ts'
import type { AuthEmail }   from '../../types/index.ts'

export interface AuthRecoveryPort {
  confirmRecoveryCode: (code: AuthCode, process: AuthProcess) => Promise<UserSession>
  sendRecoveryCode: (email: AuthEmail) => Promise<AuthProcess>
}
