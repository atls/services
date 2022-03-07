import { Provider }                               from '@nestjs/common'

import { FilesBucketsRegistry }                   from '../registry'
import { FILES_BUCKETS_MODULE_OPTIONS }           from './files-buckets-config-adapter-module.constants'
import { FilesBucketsConfigAdapterModuleOptions } from './files-buckets-config-adapter-module.interfaces'

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
