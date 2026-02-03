import type { AuthProcess }  from '@auth/domain-module'
import type { UserSession }  from '@auth/domain-module'

import type { AuthEmail }    from '../../types/index.ts'
import type { AuthPhone }    from '../../types/index.ts'
import type { AuthPassword } from '../../types/index.ts'

export interface AuthRegistrationResponse {
  authProcess: AuthProcess
  userSession: UserSession
}

export interface AuthRegistrationPort {
  registerByEmail: (email: AuthEmail, password: AuthPassword) => Promise<AuthRegistrationResponse>
  registerByPhone: (phone: AuthPhone, password: AuthPassword) => Promise<AuthRegistrationResponse>
}
