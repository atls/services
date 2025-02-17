import type { Provider }                         from '@nestjs/common'

import type { FilesStorageAdapterModuleOptions } from './files-storage-adapter-module.interfaces.js'

import { Storage }                               from '../storage/index.js'
import { FILES_STORAGE_MODULE_OPTIONS }          from './files-storage-adapter-module.constants.js'

export const createFilesOptionsProvider = (
  options?: FilesStorageAdapterModuleOptions
): Array<Provider> => [
  {
    provide: FILES_STORAGE_MODULE_OPTIONS,
    useValue: options || {},
  },
]

export const createFilesProvider = (): Array<Provider> => []

export const createFilesExportsProvider = (): Array<Provider> => [Storage]
