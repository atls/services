import { GrpcIdentityModule }      from '@atls/nestjs-grpc-identity'
import { GrpcIdentityEnvConfig }   from '@atls/nestjs-grpc-identity'
import { GrpcPlaygroundModule }    from '@atls/nestjs-grpc-playground'
import { PrivateKeyAuthenticator } from '@atls/nestjs-grpc-playground'
import { DynamicModule }           from '@nestjs/common'
import { Module }                  from '@nestjs/common'

import * as controllers            from '../controllers'
import { serverOptions }           from './server.options'

@Module({})
export class FilesGrpcAdapterModule {
  static register(): DynamicModule {
    return {
      module: FilesGrpcAdapterModule,
      controllers: Object.values(controllers),
      imports: [
        GrpcIdentityModule.registerAsync({
          useClass: GrpcIdentityEnvConfig,
        }),
        GrpcPlaygroundModule.register({
          options: serverOptions.options,
          authenticator: process.env.IDENTITY_PRIVATE_KEY
            ? new PrivateKeyAuthenticator(process.env.IDENTITY_PRIVATE_KEY!)
            : undefined,
        }),
      ],
      exports: [GrpcIdentityModule],
    }
  }
}
