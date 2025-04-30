import type { ApolloDriverConfig } from '@nestjs/apollo'

import { join }                    from 'node:path'

import { ApolloDriver }            from '@nestjs/apollo'
import { Module }                  from '@nestjs/common'
import { GraphQLModule }           from '@nestjs/graphql'

import { FilesGatewayModule }      from '@files-engine/gateway-module'

@Module({
  imports: [
    FilesGatewayModule.register(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      introspection: true,
      autoSchemaFile:
        process.env.NODE_ENV === 'production'
          ? join(process.cwd(), 'dist/schema.gql')
          : join(process.cwd(), 'schema.gql'),
      sortSchema: true,
    }),
  ],
})
export class FilesEngineGatewayEntrypointModule {}
