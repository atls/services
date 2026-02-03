import type { ClassProvider }            from '@nestjs/common'

import { AUTH_LOGIN_PORT }               from '@auth/application-module'
import { AUTH_RECOVERY_PORT }            from '@auth/application-module'
import { AUTH_REGISTRATION_PORT }        from '@auth/application-module'
import { AUTH_SETTINGS_PORT }            from '@auth/application-module'
import { AUTH_VERIFICATION_PORT }        from '@auth/application-module'
import { AUTH_SSO_PORT }                 from '@auth/application-module'

import { KratosAuthLoginAdapter }        from '../adapters/index.js'
import { KratosAuthRecoveryAdapter }     from '../adapters/index.js'
import { KratosAuthRegistrationAdapter } from '../adapters/index.js'
import { KratosAuthSettingsAdapter }     from '../adapters/index.js'
import { KratosAuthVerificationAdapter } from '../adapters/index.js'
import { KratosAuthSsoAdapter }          from '../adapters/index.js'

export const infrastructureProviders: Array<ClassProvider> = [
  {
    provide: AUTH_LOGIN_PORT,
    useClass: KratosAuthLoginAdapter,
  },
  {
    provide: AUTH_RECOVERY_PORT,
    useClass: KratosAuthRecoveryAdapter,
  },
  {
    provide: AUTH_REGISTRATION_PORT,
    useClass: KratosAuthRegistrationAdapter,
  },
  {
    provide: AUTH_SETTINGS_PORT,
    useClass: KratosAuthSettingsAdapter,
  },
  {
    provide: AUTH_VERIFICATION_PORT,
    useClass: KratosAuthVerificationAdapter,
  },
  {
    provide: AUTH_SSO_PORT,
    useClass: KratosAuthSsoAdapter,
  },
]
