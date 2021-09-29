import { Provider }                         from '@nestjs/common'

import { FilesStorageAdapterModuleOptions } from './files-storage-adapter-module.interfaces'
import { FILES_STORAGE_MODULE_OPTIONS }     from './files-storage-adapter-module.constants'
import { Storage }                          from '../storage'

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
