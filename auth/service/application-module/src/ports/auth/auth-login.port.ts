import type { AuthProcess }    from '@auth/domain-module'
import type { UserSession }    from '@auth/domain-module'

import type { AuthCode }       from '../../types/index.ts'
import type { AuthIdentifier } from '../../types/index.ts'
import type { AuthEmail }      from '../../types/index.ts'
import type { AuthPhone }      from '../../types/index.ts'
import type { AuthPassword }   from '../../types/index.ts'

export interface AuthLoginPort {
  loginByEmail: (
    email: AuthEmail,
    password: AuthPassword,
    process?: AuthProcess
  ) => Promise<UserSession>
  loginByPhone: (phone: AuthPhone) => Promise<AuthProcess>
  confirmLoginCode: (
    code: AuthCode,
    identifier: AuthIdentifier,
    process: AuthProcess
  ) => Promise<UserSession>
}
