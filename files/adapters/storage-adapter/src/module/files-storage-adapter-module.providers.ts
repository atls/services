import { Provider }                         from '@nestjs/common'

import { Storage }                          from '../storage'
import { FILES_STORAGE_MODULE_OPTIONS }     from './files-storage-adapter-module.constants'
import { FilesStorageAdapterModuleOptions } from './files-storage-adapter-module.interfaces'

export const createFilesOptionsProvider = (
  options?: FilesStorageAdapterModuleOptions
): Provider[] => [
  {
    provide: FILES_STORAGE_MODULE_OPTIONS,
    useValue: options || {},
  },
]

export const createFilesProvider = (): Provider[] => []

export const createFilesExportsProvider = (): Provider[] => [Storage]
