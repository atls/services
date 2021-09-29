import { Provider }                        from '@nestjs/common'

import { FilesProjectionModuleOptions }    from './files-projection-module.interfaces'
import { FILES_PROJECTION_MODULE_OPTIONS } from './files-projection-module.constants'
import { FileEntitySubscriber }            from '../subscribers'
import { FilesProjector }                  from '../projectors'
import { UploadsProjector }                from '../projectors'
import { UploadsQueryHandler }             from '../queries'
import { FilesQueryHandler }               from '../queries'

export const createFilesOptionsProvider = (options: FilesProjectionModuleOptions): Provider[] => [
  {
    provide: FILES_PROJECTION_MODULE_OPTIONS,
    useValue: options,
  },
]

export const createFilesProvider = (): Provider[] => [
  UploadsProjector,
  UploadsQueryHandler,
  FilesProjector,
  FilesQueryHandler,
  FileEntitySubscriber,
]

export const createFilesExportsProvider = (): Provider[] => []
