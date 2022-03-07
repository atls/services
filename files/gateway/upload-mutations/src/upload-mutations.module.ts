import { DynamicModule }             from '@nestjs/common'
import { Module }                    from '@nestjs/common'

import { UploadServiceClientModule } from '@atls/services-proto-upload'

import { UploadMutations }           from './mutations'

@Module({})
export class UploadMutationsModule {
  static register(): DynamicModule {
    return {
      module: UploadMutationsModule,
      imports: [UploadServiceClientModule.register()],
      providers: [UploadMutations],
    }
  }
}
