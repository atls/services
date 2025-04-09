import type { MikroOrmModuleOptions }                  from '@mikro-orm/nestjs'
import type { DynamicModule }                          from '@nestjs/common'
import type { OnModuleInit }                           from '@nestjs/common'

import type { FilesEngineInfrastructureModuleOptions } from './files-engine-infrastructure.module.interfaces.js'

import { ConnectRpcServer }                            from '@atls/nestjs-connectrpc'
import { ServerProtocol }                              from '@atls/nestjs-connectrpc'
import { CqrsModule }                                  from '@atls/nestjs-cqrs'
import { CqrsKafkaEventsModule }                       from '@atls/nestjs-cqrs-kafka-events'
import { GcsClientModule }                             from '@atls/nestjs-gcs-client'
import { GcsClientFactory }                            from '@atls/nestjs-gcs-client'
import { MicroservisesRegistryModule }                 from '@atls/nestjs-microservices-registry'
import { MikroORMConfigModule }                        from '@atls/nestjs-mikro-orm-config'
import { MikroORMConfig }                              from '@atls/nestjs-mikro-orm-config'
import { MikroORMRequestContextModule }                from '@atls/nestjs-mikro-orm-request-context'
import { S3ClientModule }                              from '@atls/nestjs-s3-client'
import { S3ClientFactory }                             from '@atls/nestjs-s3-client'
import { ValidationModule }                            from '@atls/nestjs-validation'
import { MikroORM }                                    from '@mikro-orm/core'
import { MikroOrmModule }                              from '@mikro-orm/nestjs'
import { PostgreSqlDriver }                            from '@mikro-orm/postgresql'
import { Module }                                      from '@nestjs/common'

import { TransactionalRepository }                     from '@files-engine/domain-module'
import { UploadRepository }                            from '@files-engine/domain-module'
import { FileRepository }                              from '@files-engine/domain-module'
import { FilesBucketsAdapter }                         from '@files-engine/domain-module'
import { FilesStorageAdapter }                         from '@files-engine/domain-module'

import * as controllers                                from '../controllers/index.js'
import * as entities                                   from '../entities/index.js'
import * as mappers                                    from '../mappers/index.js'
import * as migrations                                 from '../migrations/index.js'
import { S3FilesStorageAdapterImpl }                   from '../ports/index.js'
import { GcsFilesStorageAdapterImpl }                  from '../ports/index.js'
import { EnvFilesBucketsAdapterImpl }                  from '../ports/index.js'
import { TransactionalRepositoryImpl }                 from '../repositories/index.js'
import { UploadRepositoryImpl }                        from '../repositories/index.js'
import { FileRepositoryImpl }                          from '../repositories/index.js'
import { FilesEngineInfrastructureModuleConfig }       from './files-engine-infrastructure.module.config.js'
import { FILES_ENGINE_INFRASTRUCTURE_MODULE_OPTIONS }  from './files-engine-infrastructure.module.constants.js'

@Module({})
export class FilesEngineInfrastructureModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  static register(options: FilesEngineInfrastructureModuleOptions = {}): DynamicModule {
    const providers = [
      {
        provide: FILES_ENGINE_INFRASTRUCTURE_MODULE_OPTIONS,
        useValue: options,
      },
      {
        provide: FilesEngineInfrastructureModuleConfig,
        useClass: FilesEngineInfrastructureModuleConfig,
      },
      {
        provide: FilesStorageAdapter,
        useFactory: (
          config: FilesEngineInfrastructureModuleConfig,
          s3ClientFactory: S3ClientFactory,
          googleStorageFactory: GcsClientFactory
        ): FilesStorageAdapter =>
          config.storage === 'gcs'
            ? new GcsFilesStorageAdapterImpl(googleStorageFactory.create())
            : new S3FilesStorageAdapterImpl(s3ClientFactory.create(), config, s3ClientFactory),
        inject: [FilesEngineInfrastructureModuleConfig, S3ClientFactory, GcsClientFactory],
      },
      {
        provide: FilesBucketsAdapter,
        useClass: EnvFilesBucketsAdapterImpl,
      },
      {
        provide: TransactionalRepository,
        useClass: TransactionalRepositoryImpl,
      },
      {
        provide: UploadRepository,
        useClass: UploadRepositoryImpl,
      },
      {
        provide: FileRepository,
        useClass: FileRepositoryImpl,
      },
    ]

    return {
      global: true,
      module: FilesEngineInfrastructureModule,
      controllers: Object.values(controllers),
      imports: [
        MikroORMRequestContextModule.forInterceptor(),
        MicroservisesRegistryModule.connect({
          strategy: new ConnectRpcServer({
            protocol: ServerProtocol.HTTP2_INSECURE,
            port: 50051,
          }),
        }),
        ValidationModule.register(),
        CqrsModule.forRoot(),
        MikroOrmModule.forFeature(Object.values(entities)),
        MikroOrmModule.forRootAsync({
          imports: [
            MikroORMConfigModule.register({
              driver: PostgreSqlDriver,
              migrationsList: migrations,
              migrationsTableName: 'mikro_orm_migrations_FILES_ENGINE',
              entities,
            }),
          ],
          useFactory: (mikroORMConfig: MikroORMConfig, config): MikroOrmModuleOptions =>
            ({
              ...mikroORMConfig.createMikroOrmOptions(),
              ...config.db,
            }) as MikroOrmModuleOptions,
          inject: [MikroORMConfig, FilesEngineInfrastructureModuleConfig],
        }),
        CqrsKafkaEventsModule.registerAsync({
          useFactory: (config: FilesEngineInfrastructureModuleConfig) => config.events,
          inject: [FilesEngineInfrastructureModuleConfig],
        }),
        GcsClientModule.registerAsync({
          useFactory: (config: FilesEngineInfrastructureModuleConfig) => config.gcs,
          inject: [FilesEngineInfrastructureModuleConfig],
        }),
        S3ClientModule.registerAsync({
          useFactory: (config: FilesEngineInfrastructureModuleConfig) => config.s3,
          inject: [FilesEngineInfrastructureModuleConfig],
        }),
      ],
      providers: [...Object.values(mappers), ...providers],
      exports: [...providers],
    }
  }

  async onModuleInit(): Promise<void> {
    await this.orm.getMigrator().up()
  }
}
