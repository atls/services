import { Provider }                               from '@nestjs/common'

import { FilesBucketsConfigAdapterModuleOptions } from './files-buckets-config-adapter-module.interfaces'
import { FILES_BUCKETS_MODULE_OPTIONS }           from './files-buckets-config-adapter-module.constants'
import { FilesBucketsRegistry }                   from '../registry'

export const createFilesOptionsProvider = (
  options?: FilesBucketsConfigAdapterModuleOptions
): Provider[] => [
  {
    provide: FILES_BUCKETS_MODULE_OPTIONS,
    useValue: options || {},
  },
]

export const createFilesProvider = (): Provider[] => []

export const createFilesExportsProvider = (): Provider[] => [FilesBucketsRegistry]
