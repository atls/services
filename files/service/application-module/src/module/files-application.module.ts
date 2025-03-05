import { DynamicModule }    from '@nestjs/common'
import { Module }           from '@nestjs/common'

import * as commandHandlers from '../command-handlers/index.js'
import * as queryHandlers   from '../query-handlers/index.js'

@Module({})
export class ApplicationModule {
  static register(): DynamicModule {
    return {
      module: ApplicationModule,
      providers: [...Object.values(commandHandlers), ...Object.values(queryHandlers)],
    }
  }
}
