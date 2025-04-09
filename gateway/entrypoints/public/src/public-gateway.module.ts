import { GatewayModule } from '@atls/nestjs-gateway'
import { Module }        from '@nestjs/common'

import { filesHandler }  from './handlers/index.js'
import { createSources } from './utils/index.js'

@Module({
  imports: [
    GatewayModule.register({
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
      transforms: {
        namingConvention: {
          fieldNames: 'camelCase',
        },
      },
      sources: createSources([filesHandler]),
    }),
  ],
})
export class PublicGatewayModule {}
