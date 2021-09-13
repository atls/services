import { DynamicModule, Module, Provider }  from '@nestjs/common'

import { AccountsSsoModuleAsyncOptions }    from './accounts-idp-module-options.interface'
import { AccountsSsoModuleOptions }         from './accounts-idp-module-options.interface'
import { AccountsSsoOptionsFactory }        from './accounts-idp-module-options.interface'
import { ACCOUNTS_MODULE_OPTIONS }          from './accounts-idp.constants'
import { controllers }                      from '../controllers'
import { createAccountsSsoExportsProvider } from './accounts-idp.providers'
import { createAccountsSsoProvider }        from './accounts-idp.providers'
import { createAccountsSsoOptionsProvider } from './accounts-idp.providers'

@Module({})
export class AccountsSsoModule {
  static register(options?: AccountsSsoModuleOptions): DynamicModule {
    const optionsProviders = createAccountsSsoOptionsProvider(options)
    const exportsProviders = createAccountsSsoExportsProvider()
    const providers = createAccountsSsoProvider()

    return {
      global: true,
      module: AccountsSsoModule,
      providers: [...optionsProviders, ...providers, ...exportsProviders],
      exports: exportsProviders,
      controllers,
    }
  }

  static registerAsync(options: AccountsSsoModuleAsyncOptions): DynamicModule {
    const exportsProviders = createAccountsSsoExportsProvider()
    const providers = createAccountsSsoProvider()

    return {
      global: true,
      module: AccountsSsoModule,
      imports: options.imports || [],
      providers: [...this.createAsyncProviders(options), ...providers, ...exportsProviders],
      exports: exportsProviders,
      controllers,
    }
  }

  private static createAsyncProviders(options: AccountsSsoModuleAsyncOptions): Provider[] {
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

  private static createAsyncOptionsProvider(options: AccountsSsoModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: ACCOUNTS_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }

    return {
      provide: ACCOUNTS_MODULE_OPTIONS,
      useFactory: (optionsFactory: AccountsSsoOptionsFactory) =>
        optionsFactory.createAccountsSsoOptions(),
      inject: [options.useExisting! || options.useClass!],
    }
  }
}
