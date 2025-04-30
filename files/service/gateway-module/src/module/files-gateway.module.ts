import type { DynamicModule } from '@nestjs/common'

import { Module }             from '@nestjs/common'

import * as dataLoaders       from '../data-loaders/index.js'
import * as mutations         from '../mutations/index.js'
import * as queries           from '../queries/index.js'

@Module({})
export class FilesGatewayModule {
  static register(): DynamicModule {
    const providers = [
      ...Object.values(mutations),
      ...Object.values(queries),
      ...Object.values(dataLoaders),
    ]

    return {
      module: FilesGatewayModule,
      providers,
      exports: providers,
    }
  }
}
