import { ModuleMetadata, Type } from '@nestjs/common/interfaces'

import { FilesBucket }          from '@files/domain-module'

export interface FilesBucketsConfigAdapterModuleOptions {
  buckets: Array<FilesBucket>
}

export interface FilesBucketsConfigAdapterOptionsFactory {
  createFilesBucketsConfigOptions():
    | Promise<FilesBucketsConfigAdapterModuleOptions>
    | FilesBucketsConfigAdapterModuleOptions
}

export interface FilesBucketsConfigAdapterModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<FilesBucketsConfigAdapterOptionsFactory>
  useClass?: Type<FilesBucketsConfigAdapterOptionsFactory>
  useFactory?: (
    ...args: any[]
  ) => Promise<FilesBucketsConfigAdapterModuleOptions> | FilesBucketsConfigAdapterModuleOptions
  inject?: any[]
}
