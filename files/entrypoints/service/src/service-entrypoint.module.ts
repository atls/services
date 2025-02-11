import { Module }                          from '@nestjs/common'

import { ApplicationModule }               from '@files/application-module'
import { FilesBucketsConfigAdapterModule } from '@files/buckets-config-adapter'
import { FilesBucketsEnvConfig }           from '@files/buckets-config-adapter'
import { ConfigAdapterModule }             from '@files/config-adapter'
import { ConfigModule }                    from '@files/config-adapter'
import { ConfigService }                   from '@files/config-adapter'
import { CqrsAdapterModule }               from '@files/cqrs-adapter'
import { GrpcAdapterModule }               from '@files/grpc-adapter'
import { InfrastructureModule }            from '@files/infrastructure-module'
import { MikroOrmAdapterModule }           from '@files/mikro-orm-adapter'
import { FilesApplicationEnvConfig }       from '@files/storage-adapter'
import { FilesStorageAdapterModule }       from '@files/storage-adapter'

import * as configs                        from './configs/index.js'

@Module({
  imports: [
    ConfigAdapterModule.register({ load: Object.values(configs) }),
    CqrsAdapterModule.register(),
    GrpcAdapterModule.register(),
    FilesStorageAdapterModule.registerAsync({
      useClass: FilesApplicationEnvConfig,
    }),
    FilesBucketsConfigAdapterModule.registerAsync({
      useClass: FilesBucketsEnvConfig,
    }),
    MikroOrmAdapterModule.register({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        port: parseInt(configService.get('database.port') || '', 10),
        host: configService.get('database.host'),
        dbName: configService.get('database.dbName'),
        user: configService.get('database.user'),
        password: configService.get('database.password'),
      }),
      inject: [ConfigService],
    }),
    InfrastructureModule.register(),
    ApplicationModule.register(),
  ],
})
export class ServiceEntrypointModule {}
