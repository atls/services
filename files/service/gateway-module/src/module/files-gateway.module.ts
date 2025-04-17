import type { DynamicModule } from '@nestjs/common'

import { Module }             from '@nestjs/common'

import * as dataloaders       from '../dataloaders/index.js'
import * as mutations         from '../mutations/index.js'

@Module({})
export class FilesGatewayModule {
  static register(): DynamicModule {
    return {
      module: FilesGatewayModule,
      providers: [...Object.values(mutations), ...Object.values(dataloaders)],
    }
  }
}
