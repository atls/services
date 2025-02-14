import { GatewaySourceType }         from '@atls/nestjs-gateway'
import { GatewayModule }             from '@atls/nestjs-gateway'
import { Module }                    from '@nestjs/common'

import { filesGatewayHandler }       from '@atls/services-proto-files'

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
      sources: [
        {
          name: 'Files',
          type: GatewaySourceType.GRPC,
          handler: filesGatewayHandler,
          transforms: {
            rename: {
              mode: 'bare',
              renames: [
                {
                  from: {
                    type: 'tech_atls_files_v1_(.*)Request_Input',
                  },
                  to: {
                    type: '$1Input',
                  },
                  useRegExpForTypes: true,
                  useRegExpForFields: true,
                },
                {
                  from: {
                    type: 'tech_atls_files_v1_(.*)',
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
                    field: 'tech_atls_files_v1_FilesService_(.*)',
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
                    field: 'tech_atls_files_v1_FilesService_(.*)',
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
        },
      ],
    }),
  ],
})
export class PublicGatewayModule {}
