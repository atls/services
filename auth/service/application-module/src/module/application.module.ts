import { DynamicModule }        from '@nestjs/common'
import { Module }               from '@nestjs/common'

import { applicationProviders } from './application.providers.js'

@Module({})
export class ApplicationModule {
  static register(): DynamicModule {
    return {
      module: ApplicationModule,
      providers: applicationProviders,
    }
  }
}
