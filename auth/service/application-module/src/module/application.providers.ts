import type { Type as ProviderType } from '@nestjs/common'

import * as commandHandlers          from '../command-handlers/index.js'
import * as queryHandlers            from '../query-handlers/index.js'
import * as useCases                 from '../use-cases/index.js'

export const applicationProviders: Array<ProviderType> = [
  ...Object.values(commandHandlers),
  ...Object.values(queryHandlers),
  ...Object.values(useCases),
]
