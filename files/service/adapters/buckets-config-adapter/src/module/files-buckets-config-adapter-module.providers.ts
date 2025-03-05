import type { Provider }                               from '@nestjs/common'

import type { FilesBucketsConfigAdapterModuleOptions } from './files-buckets-config-adapter-module.interfaces.js'

import { FilesBucketsRegistry }                        from '../registry/index.js'
import { FILES_BUCKETS_MODULE_OPTIONS }                from './files-buckets-config-adapter-module.constants.js'

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
