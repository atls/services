import type { Provider }                               from '@nestjs/common'

import type { FilesBucketsConfigAdapterModuleOptions } from './files-buckets-config-adapter-module.interfaces'

import { FilesBucketsRegistry }                        from '../registry'
import { FILES_BUCKETS_MODULE_OPTIONS }                from './files-buckets-config-adapter-module.constants'

export const createFilesOptionsProvider = (
  options?: FilesBucketsConfigAdapterModuleOptions
): Array<Provider> => [
  {
    provide: FILES_BUCKETS_MODULE_OPTIONS,
    useValue: options || {},
  },
]

export const createFilesProvider = (): Array<Provider> => []

export const createFilesExportsProvider = (): Array<Provider> => [FilesBucketsRegistry]
