import type { AuthProcess }  from '@auth/domain-module'
import type { UserSession }  from '@auth/domain-module'
import type { UserAccount }  from '@auth/domain-module'

import type { AuthEmail }    from '../../types/index.ts'
import type { AuthPassword } from '../../types/index.ts'
import type { AuthToken }    from '../../types/index.ts'

export interface AuthSettingsPort {
  updateEmail: (newEmail: AuthEmail, token: AuthToken) => Promise<AuthProcess>
  updatePassword: (newPassword: AuthPassword, token: AuthToken) => Promise<void>
  deleteAccount: (accountId: UserAccount['id']) => Promise<void>
  getSessionByToken: (token: AuthToken) => Promise<UserSession>
}
