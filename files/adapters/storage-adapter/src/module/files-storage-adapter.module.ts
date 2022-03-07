import { DynamicModule }                         from '@nestjs/common'
import { Module }                                from '@nestjs/common'
import { Provider }                              from '@nestjs/common'

import { FILES_STORAGE_MODULE_OPTIONS }          from './files-storage-adapter-module.constants'
import { FilesStorageAdapterModuleAsyncOptions } from './files-storage-adapter-module.interfaces'
import { FilesStorageAdapterModuleOptions }      from './files-storage-adapter-module.interfaces'
import { FilesStorageAdapterOptionsFactory }     from './files-storage-adapter-module.interfaces'
import { createFilesExportsProvider }            from './files-storage-adapter-module.providers'
import { createFilesProvider }                   from './files-storage-adapter-module.providers'
import { createFilesOptionsProvider }            from './files-storage-adapter-module.providers'

@Module({})
export class FilesStorageAdapterModule {
  static register(options?: FilesStorageAdapterModuleOptions): DynamicModule {
    const optionsProviders = createFilesOptionsProvider(options)
    const exportsProviders = createFilesExportsProvider()
    const providers = createFilesProvider()

    return {
      global: true,
      module: FilesStorageAdapterModule,
      providers: [...optionsProviders, ...providers, ...exportsProviders],
      exports: exportsProviders,
    }
  }

  static registerAsync(options: FilesStorageAdapterModuleAsyncOptions): DynamicModule {
    const exportsProviders = createFilesExportsProvider()
    const providers = createFilesProvider()

    return {
      global: true,
      module: FilesStorageAdapterModule,
      imports: options.imports || [],
      providers: [...this.createAsyncProviders(options), ...providers, ...exportsProviders],
      exports: exportsProviders,
    }
  }

  private static createAsyncProviders(options: FilesStorageAdapterModuleAsyncOptions): Provider[] {
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
    options: FilesStorageAdapterModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: FILES_STORAGE_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }

    return {
      provide: FILES_STORAGE_MODULE_OPTIONS,
      useFactory: (optionsFactory: FilesStorageAdapterOptionsFactory) =>
        optionsFactory.createFilesStorageOptions(),
      inject: [options.useExisting! || options.useClass!],
    }
  }
}
