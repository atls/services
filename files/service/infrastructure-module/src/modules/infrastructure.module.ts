import { DynamicModule }           from '@nestjs/common'
import { Module }                  from '@nestjs/common'

import { infrastructureProviders } from './infrastructure.providers.js'

@Module({})
export class InfrastructureModule {
  static register(): DynamicModule {
    return {
      global: true,
      module: InfrastructureModule,
      providers: infrastructureProviders,
      exports: infrastructureProviders,
    }
  }
}
