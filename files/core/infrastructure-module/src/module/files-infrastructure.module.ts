import { DynamicModule }                       from '@nestjs/common'
import { Module }                              from '@nestjs/common'
import { CqrsModule }                          from '@nestjs/cqrs'
import { TypeOrmModule }                       from '@nestjs/typeorm'

import { UploadRepository }                    from '@files/domain-module'
import { FileRepository }                      from '@files/domain-module'

import * as entities                           from '../entities'
import { UploadRepositoryImpl }                from '../repositories'
import { FileRepositoryImpl }                  from '../repositories'
import { FILES_INFRASTRUCTURE_MODULE_OPTIONS } from './files-infrastructure-module.contants'
import { FilesInfrastructureOptions }          from './files-infrastructure-module.interfaces'
import { TypeOrmConfig }                       from './typeorm.config'

@Module({})
export class FilesInfrastructureModule {
  static register(options: FilesInfrastructureOptions = {}): DynamicModule {
    return {
      global: true,
      module: FilesInfrastructureModule,
      imports: [
        CqrsModule,
        TypeOrmModule.forFeature(Object.values(entities)),
        TypeOrmModule.forRootAsync({
          useExisting: TypeOrmConfig,
        }),
      ],
      providers: [
        TypeOrmConfig,
        {
          provide: FILES_INFRASTRUCTURE_MODULE_OPTIONS,
          useValue: options,
        },
        {
          provide: UploadRepository,
          useClass: UploadRepositoryImpl,
        },
        {
          provide: FileRepository,
          useClass: FileRepositoryImpl,
        },
      ],
      exports: [
        TypeOrmModule,
        CqrsModule,
        TypeOrmConfig,
        {
          provide: UploadRepository,
          useClass: UploadRepositoryImpl,
        },
        {
          provide: FileRepository,
          useClass: FileRepositoryImpl,
        },
      ],
    }
  }
}
