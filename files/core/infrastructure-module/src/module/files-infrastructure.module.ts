import type { DynamicModule }                  from '@nestjs/common'

import type { FilesInfrastructureOptions }     from './files-infrastructure-module.interfaces.js'

import { Module }                              from '@nestjs/common'
import { CqrsModule }                          from '@nestjs/cqrs'
import { TypeOrmModule }                       from '@nestjs/typeorm'

import { UploadRepository }                    from '@files/domain-module'
import { FileRepository }                      from '@files/domain-module'

import * as entities                           from '../entities/index.js'
import { UploadRepositoryImpl }                from '../repositories/index.js'
import { FileRepositoryImpl }                  from '../repositories/index.js'
import { FILES_INFRASTRUCTURE_MODULE_OPTIONS } from './files-infrastructure-module.contants.js'
import { TypeOrmConfig }                       from './typeorm.config.js'

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
