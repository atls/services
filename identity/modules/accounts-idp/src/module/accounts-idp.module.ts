import { DynamicModule, Module, Provider }  from '@nestjs/common'

import { AccountsIdpModuleAsyncOptions }    from './accounts-idp-module-options.interface'
import { AccountsIdpModuleOptions }         from './accounts-idp-module-options.interface'
import { AccountsIdpOptionsFactory }        from './accounts-idp-module-options.interface'
import { ACCOUNTS_MODULE_OPTIONS }          from './accounts-idp.constants'
import { controllers }                      from '../controllers'
import { createAccountsIdpExportsProvider } from './accounts-idp.providers'
import { createAccountsIdpProvider }        from './accounts-idp.providers'
import { createAccountsIdpOptionsProvider } from './accounts-idp.providers'

@Module({})
export class AccountsIdpModule {
  static register(options?: AccountsIdpModuleOptions): DynamicModule {
    const optionsProviders = createAccountsIdpOptionsProvider(options)
    const exportsProviders = createAccountsIdpExportsProvider()
    const providers = createAccountsIdpProvider()

    return {
      global: true,
      module: AccountsIdpModule,
      providers: [...optionsProviders, ...providers, ...exportsProviders],
      exports: exportsProviders,
      controllers,
    }
  }

  static registerAsync(options: AccountsIdpModuleAsyncOptions): DynamicModule {
    const exportsProviders = createAccountsIdpExportsProvider()
    const providers = createAccountsIdpProvider()

    return {
      global: true,
      module: AccountsIdpModule,
      imports: options.imports || [],
      providers: [...this.createAsyncProviders(options), ...providers, ...exportsProviders],
      exports: exportsProviders,
      controllers,
    }
  }

  private static createAsyncProviders(options: AccountsIdpModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)]
    }

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass!,
        useClass: options.useClass!,
      },
    ]
  }

  private static createAsyncOptionsProvider(options: AccountsIdpModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: ACCOUNTS_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }

    return {
      provide: ACCOUNTS_MODULE_OPTIONS,
      useFactory: (optionsFactory: AccountsIdpOptionsFactory) =>
        optionsFactory.createAccountsIdpOptions(),
      inject: [options.useExisting! || options.useClass!],
    }
  }
}
