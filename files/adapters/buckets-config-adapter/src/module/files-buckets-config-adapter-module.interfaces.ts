import type { FilesBucket }    from '@files/domain-module'
import type { ModuleMetadata } from '@nestjs/common/interfaces'
import type { Type }           from '@nestjs/common/interfaces'

export interface FilesBucketsConfigAdapterModuleOptions {
  buckets: Array<FilesBucket>
}

export interface FilesBucketsConfigAdapterOptionsFactory {
  createFilesBucketsConfigOptions: () =>
    | FilesBucketsConfigAdapterModuleOptions
    | Promise<FilesBucketsConfigAdapterModuleOptions>
}

export interface FilesBucketsConfigAdapterModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<FilesBucketsConfigAdapterOptionsFactory>
  useClass?: Type<FilesBucketsConfigAdapterOptionsFactory>
  useFactory?: (
    ...args: Array<any>
  ) => FilesBucketsConfigAdapterModuleOptions | Promise<FilesBucketsConfigAdapterModuleOptions>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inject?: Array<any>
}
