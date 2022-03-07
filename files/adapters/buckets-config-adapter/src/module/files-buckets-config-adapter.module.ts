import { DynamicModule }                               from '@nestjs/common'
import { Module }                                      from '@nestjs/common'
import { Provider }                                    from '@nestjs/common'

import { FILES_BUCKETS_MODULE_OPTIONS }                from './files-buckets-config-adapter-module.constants'
import { FilesBucketsConfigAdapterModuleAsyncOptions } from './files-buckets-config-adapter-module.interfaces'
import { FilesBucketsConfigAdapterModuleOptions }      from './files-buckets-config-adapter-module.interfaces'
import { FilesBucketsConfigAdapterOptionsFactory }     from './files-buckets-config-adapter-module.interfaces'
import { createFilesExportsProvider }                  from './files-buckets-config-adapter-module.providers'
import { createFilesProvider }                         from './files-buckets-config-adapter-module.providers'
import { createFilesOptionsProvider }                  from './files-buckets-config-adapter-module.providers'

@Module({})
export class FilesBucketsConfigAdapterModule {
  static register(options?: FilesBucketsConfigAdapterModuleOptions): DynamicModule {
    const optionsProviders = createFilesOptionsProvider(options)
    const exportsProviders = createFilesExportsProvider()
    const providers = createFilesProvider()

    return {
      global: true,
      module: FilesBucketsConfigAdapterModule,
      providers: [...optionsProviders, ...providers, ...exportsProviders],
      exports: exportsProviders,
    }
  }

  static registerAsync(options: FilesBucketsConfigAdapterModuleAsyncOptions): DynamicModule {
    const exportsProviders = createFilesExportsProvider()
    const providers = createFilesProvider()

    return {
      global: true,
      module: FilesBucketsConfigAdapterModule,
      imports: options.imports || [],
      providers: [...this.createAsyncProviders(options), ...providers, ...exportsProviders],
      exports: exportsProviders,
    }
  }

  private static createAsyncProviders(
    options: FilesBucketsConfigAdapterModuleAsyncOptions
  ): Provider[] {
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

  private static createAsyncOptionsProvider(
    options: FilesBucketsConfigAdapterModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: FILES_BUCKETS_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }

    return {
      provide: FILES_BUCKETS_MODULE_OPTIONS,
      useFactory: (optionsFactory: FilesBucketsConfigAdapterOptionsFactory) =>
        optionsFactory.createFilesBucketsConfigOptions(),
      inject: [options.useExisting! || options.useClass!],
    }
  }
}
