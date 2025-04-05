import { GatewayModule }       from '@atls/nestjs-gateway'
import { Module }              from '@nestjs/common'

import { filesGatewayHandler } from '@atls/files-rpc'

import { createSources }       from './utils/index.js'

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
      sources: createSources([filesGatewayHandler]),
    }),
  ],
})
export class PublicGatewayModule {}
