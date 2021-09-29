import { ModuleMetadata, Type } from '@nestjs/common/interfaces'

import { StoragePort }          from '../ports'

export interface FilesProjectionModuleOptions {
  storage: StoragePort
}

export interface FilesProjectionOptionsFactory {
  createFilesProjectionOptions():
    | Promise<FilesProjectionModuleOptions>
    | FilesProjectionModuleOptions
}

export interface FilesProjectionModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<FilesProjectionOptionsFactory>
  useClass?: Type<FilesProjectionOptionsFactory>
  useFactory?: (
    ...args: any[]
  ) => Promise<FilesProjectionModuleOptions> | FilesProjectionModuleOptions
  inject?: any[]
}
