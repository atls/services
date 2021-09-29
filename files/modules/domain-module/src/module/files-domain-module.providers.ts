import { Provider }                    from '@nestjs/common'

import { FilesDomainModuleOptions }    from './files-domain-module.interfaces'
import { FILES_DOMAIN_MODULE_OPTIONS } from './files-domain-module.constants'
import { Upload }                      from '../aggregates'

export const createFilesOptionsProvider = (options: FilesDomainModuleOptions): Provider[] => [
  {
    provide: FILES_DOMAIN_MODULE_OPTIONS,
    useValue: options,
  },
]

export const createFilesProvider = (): Provider[] => [
  {
    provide: Upload,
    useFactory: (options: FilesDomainModuleOptions) =>
      new Upload(options.bucketsRegistry, options.storage),
    inject: [FILES_DOMAIN_MODULE_OPTIONS],
  },
]

export const createFilesExportsProvider = (): Provider[] => []
