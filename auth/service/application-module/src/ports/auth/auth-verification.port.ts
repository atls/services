import type { AuthProcess } from '@auth/domain-module'

import type { AuthCode }    from '../../types/index.ts'
import type { AuthEmail }   from '../../types/index.ts'

export interface AuthVerificationPort {
  confirmVerificationCode: (code: AuthCode, process: AuthProcess) => Promise<void>
  sendVerificationCode: (email: AuthEmail) => Promise<AuthProcess>
}
