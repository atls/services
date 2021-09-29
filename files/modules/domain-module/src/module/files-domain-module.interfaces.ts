import { ModuleMetadata, Type }     from '@nestjs/common/interfaces'

import { FilesBucketsRegistryPort } from '../ports'
import { StoragePort }              from '../ports'

export interface FilesDomainModuleOptions {
  bucketsRegistry: FilesBucketsRegistryPort
  storage: StoragePort
}

export interface FilesDomainOptionsFactory {
  createFilesDomainOptions(): Promise<FilesDomainModuleOptions> | FilesDomainModuleOptions
}

export interface FilesDomainModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<FilesDomainOptionsFactory>
  useClass?: Type<FilesDomainOptionsFactory>
  useFactory?: (...args: any[]) => Promise<FilesDomainModuleOptions> | FilesDomainModuleOptions
  inject?: any[]
}
