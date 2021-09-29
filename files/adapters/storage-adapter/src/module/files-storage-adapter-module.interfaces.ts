import { ModuleMetadata, Type } from '@nestjs/common/interfaces'
import { StorageOptions }       from '@google-cloud/storage'

export type FilesStorageAdapterModuleOptions = StorageOptions

export interface FilesStorageAdapterOptionsFactory {
  createFilesStorageOptions():
    | Promise<FilesStorageAdapterModuleOptions>
    | FilesStorageAdapterModuleOptions
}

export interface FilesStorageAdapterModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<FilesStorageAdapterOptionsFactory>
  useClass?: Type<FilesStorageAdapterOptionsFactory>
  useFactory?: (
    ...args: any[]
  ) => Promise<FilesStorageAdapterModuleOptions> | FilesStorageAdapterModuleOptions
  inject?: any[]
}
