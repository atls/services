import { Provider }                 from '@nestjs/common'

import { AccountsSsoModuleOptions } from './accounts-idp-module-options.interface'
import { ACCOUNTS_MODULE_OPTIONS }  from './accounts-idp.constants'

export const createAccountsSsoOptionsProvider = (
  options?: AccountsSsoModuleOptions
): Provider[] => [
  {
    provide: ACCOUNTS_MODULE_OPTIONS,
    useValue: options || {},
  },
]

export const createAccountsSsoProvider = (): Provider[] => []

export const createAccountsSsoExportsProvider = (): Provider[] => []
