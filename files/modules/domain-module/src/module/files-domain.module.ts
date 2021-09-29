import { DynamicModule }                 from '@nestjs/common'
import { Module }                        from '@nestjs/common'
import { Provider }                      from '@nestjs/common'

import { FilesDomainModuleAsyncOptions } from './files-domain-module.interfaces'
import { FilesDomainModuleOptions }      from './files-domain-module.interfaces'
import { FilesDomainOptionsFactory }     from './files-domain-module.interfaces'
import { FILES_DOMAIN_MODULE_OPTIONS }   from './files-domain-module.constants'
import { createFilesExportsProvider }    from './files-domain-module.providers'
import { createFilesProvider }           from './files-domain-module.providers'
import { createFilesOptionsProvider }    from './files-domain-module.providers'

@Module({})
export class FilesDomainModule {
  static register(options: FilesDomainModuleOptions): DynamicModule {
    const optionsProviders = createFilesOptionsProvider(options)
    const exportsProviders = createFilesExportsProvider()
    const providers = createFilesProvider()

    return {
      module: FilesDomainModule,
      providers: [...optionsProviders, ...providers, ...exportsProviders],
      exports: exportsProviders,
    }
  }

  static registerAsync(options: FilesDomainModuleAsyncOptions): DynamicModule {
    const exportsProviders = createFilesExportsProvider()
    const providers = createFilesProvider()

    return {
      module: FilesDomainModule,
      imports: options.imports || [],
      providers: [...this.createAsyncProviders(options), ...providers, ...exportsProviders],
      exports: exportsProviders,
    }
  }

  private static createAsyncProviders(options: FilesDomainModuleAsyncOptions): Provider[] {
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

  private static createAsyncOptionsProvider(options: FilesDomainModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: FILES_DOMAIN_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }

    return {
      provide: FILES_DOMAIN_MODULE_OPTIONS,
      useFactory: (optionsFactory: FilesDomainOptionsFactory) =>
        optionsFactory.createFilesDomainOptions(),
      inject: [options.useExisting! || options.useClass!],
    }
  }
}
