import type { AuthProcess }  from '@auth/domain-module'
import type { UserSession }  from '@auth/domain-module'

import type { AuthProvider } from '../../types/index.ts'

export interface AuthSsoLoginResponse {
  authProcess?: AuthProcess
  userSession?: UserSession
}

export interface AuthSsoPort {
  loginByProvider: (
    provider: AuthProvider,
    idToken: string,
    nonce: string
  ) => Promise<AuthSsoLoginResponse>
}
