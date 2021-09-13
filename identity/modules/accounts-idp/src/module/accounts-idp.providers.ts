import { Provider }                 from '@nestjs/common'

import { AccountsIdpModuleOptions } from './accounts-idp-module-options.interface'
import { ACCOUNTS_MODULE_OPTIONS }  from './accounts-idp.constants'

export const createAccountsIdpOptionsProvider = (
  options?: AccountsIdpModuleOptions
): Provider[] => [
  {
    provide: ACCOUNTS_MODULE_OPTIONS,
    useValue: options || {},
  },
]

export const createAccountsIdpProvider = (): Provider[] => []

export const createAccountsIdpExportsProvider = (): Provider[] => []
