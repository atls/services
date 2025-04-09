import type { SourceOptions } from '@atls/nestjs-gateway'

import type { Handler }       from './create-sources.interfaces.js'

import { GatewaySourceType }  from '@atls/nestjs-gateway'

export const createSources = (handlers: Array<Handler>): Array<SourceOptions> =>
  handlers.map((handler) => {
    const formattedPackageName = handler.packageName.replaceAll('.', '_')

    return {
      name: handler.serviceName,
      type: GatewaySourceType.GRPC,
      handler,
      transforms: {
        rename: {
          mode: 'bare',
          renames: [
            {
              from: {
                type: `${formattedPackageName}_(.*)Request_Input`,
              },
              to: {
                type: '$1Input',
              },
              useRegExpForTypes: true,
              useRegExpForFields: true,
            },
            {
              from: {
                type: `${formattedPackageName}_(.*)`,
              },
              to: {
                type: '$1',
              },
              useRegExpForTypes: true,
              useRegExpForFields: true,
            },
            {
              from: {
                type: 'Mutation',
                field: `${formattedPackageName}_${handler.serviceName}_(.*)`,
              },
              to: {
                type: 'Mutation',
                field: '$1',
              },
              useRegExpForTypes: true,
              useRegExpForFields: true,
            },
            {
              from: {
                type: 'Query',
                field: `${formattedPackageName}_${handler.serviceName}_(.*)`,
              },
              to: {
                type: 'Query',
                field: '$1',
              },
              useRegExpForTypes: true,
              useRegExpForFields: true,
            },
          ],
        },
      },
    }
  })
