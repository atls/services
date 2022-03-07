import * as CommandHandlers from '../command-handlers'
import * as QueryHandlers   from '../query-handlers'

import { DynamicModule }    from '@nestjs/common'
import { Module }           from '@nestjs/common'

@Module({})
export class FilesApplicationeModule {
  static register(): DynamicModule {
    return {
      module: FilesApplicationeModule,
      providers: [...Object.values(CommandHandlers), ...Object.values(QueryHandlers)],
    }
  }
}
