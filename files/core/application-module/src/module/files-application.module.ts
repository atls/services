import type { DynamicModule } from '@nestjs/common'

import { Module }             from '@nestjs/common'

import * as CommandHandlers   from '../command-handlers/index.js'
import * as QueryHandlers     from '../query-handlers/index.js'

@Module({})
export class FilesApplicationeModule {
  static register(): DynamicModule {
    return {
      module: FilesApplicationeModule,
      providers: [...Object.values(CommandHandlers), ...Object.values(QueryHandlers)],
    }
  }
}
