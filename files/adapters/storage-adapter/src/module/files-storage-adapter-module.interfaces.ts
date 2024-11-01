import type { StorageOptions } from '@google-cloud/storage'
import type { ModuleMetadata } from '@nestjs/common/interfaces'
import type { Type }           from '@nestjs/common/interfaces'

export type FilesStorageAdapterModuleOptions = StorageOptions

export interface FilesStorageAdapterOptionsFactory {
  createFilesStorageOptions: () =>
    | FilesStorageAdapterModuleOptions
    | Promise<FilesStorageAdapterModuleOptions>
}

export interface FilesStorageAdapterModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<FilesStorageAdapterOptionsFactory>
  useClass?: Type<FilesStorageAdapterOptionsFactory>
  useFactory?: (
    ...args: Array<any>
  ) => FilesStorageAdapterModuleOptions | Promise<FilesStorageAdapterModuleOptions>
  inject?: Array<any>
}
