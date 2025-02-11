import { DynamicModule }            from '@nestjs/common'
import { Module }                   from '@nestjs/common'

import { FilesServiceClientModule } from '@atls/services-proto-files'

import { UploadMutations }          from './mutations/index.js'

@Module({})
export class UploadMutationsModule {
  static register(): DynamicModule {
    return {
      module: UploadMutationsModule,
      imports: [FilesServiceClientModule.register()],
      providers: [UploadMutations],
    }
  }
}
