import { DynamicModule }                     from '@nestjs/common'
import { Module }                            from '@nestjs/common'
import { Provider }                          from '@nestjs/common'
import { TypaProjectionModule }              from '@typa/common'

import * as entities                         from '../entities'
import * as migrations                       from '../migrations'
import { FilesProjectionModuleAsyncOptions } from './files-projection-module.interfaces'
import { FilesProjectionModuleOptions }      from './files-projection-module.interfaces'
import { FilesProjectionOptionsFactory }     from './files-projection-module.interfaces'
import { FILES_PROJECTION_MODULE_OPTIONS }   from './files-projection-module.constants'
import { createFilesExportsProvider }        from './files-projection-module.providers'
import { createFilesProvider }               from './files-projection-module.providers'
import { createFilesOptionsProvider }        from './files-projection-module.providers'

@Module({})
export class FilesProjectionModule {
  static register(options: FilesProjectionModuleOptions): DynamicModule {
    const optionsProviders = createFilesOptionsProvider(options)
    const exportsProviders = createFilesExportsProvider()
    const providers = createFilesProvider()

    return {
      module: FilesProjectionModule,
      providers: [...optionsProviders, ...providers, ...exportsProviders],
      exports: exportsProviders,
      imports: [
        TypaProjectionModule.register({
          entities,
          migrations,
        }),
      ],
    }
  }

  static registerAsync(options: FilesProjectionModuleAsyncOptions): DynamicModule {
    const exportsProviders = createFilesExportsProvider()
    const providers = createFilesProvider()

    return {
      module: FilesProjectionModule,
      imports: [
        ...(options.imports || []),
        TypaProjectionModule.register({
          entities,
          migrations,
        }),
      ],
      providers: [...this.createAsyncProviders(options), ...providers, ...exportsProviders],
      exports: exportsProviders,
    }
  }

  private static createAsyncProviders(options: FilesProjectionModuleAsyncOptions): Provider[] {
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

  private static createAsyncOptionsProvider(options: FilesProjectionModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: FILES_PROJECTION_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }

    return {
      provide: FILES_PROJECTION_MODULE_OPTIONS,
      useFactory: (optionsFactory: FilesProjectionOptionsFactory) =>
        optionsFactory.createFilesProjectionOptions(),
      inject: [options.useExisting! || options.useClass!],
    }
  }
}
