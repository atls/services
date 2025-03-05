import type { ClassProvider }   from '@nestjs/common'

import { FileRepository }       from '@files/domain-module'
import { UploadRepository }     from '@files/domain-module'

import { FileRepositoryImpl }   from '../repositories/index.js'
import { UploadRepositoryImpl } from '../repositories/index.js'

export const infrastructureProviders: Array<ClassProvider> = [
  {
    provide: FileRepository,
    useClass: FileRepositoryImpl,
  },
  {
    provide: UploadRepository,
    useClass: UploadRepositoryImpl,
  },
]
