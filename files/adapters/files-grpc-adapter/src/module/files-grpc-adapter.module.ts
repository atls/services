import { DynamicModule }         from '@nestjs/common'
import { Module }                from '@nestjs/common'
import { GrpcIdentityModule }    from '@atls/nestjs-grpc-identity'
import { GrpcIdentityEnvConfig } from '@atls/nestjs-grpc-identity'

import * as controllers          from '../controllers'

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
      ],
      exports: [GrpcIdentityModule],
    }
  }
}
