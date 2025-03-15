import type { MikroOrmModuleOptions }                  from '@mikro-orm/nestjs'
import type { CqrsKafkaEventsModuleOptions }           from '@atls/nestjs-cqrs-kafka-events'
import type { GcsClientModuleOptions }                 from '@atls/nestjs-gcs-client'
import type { S3ClientModuleOptions }                  from '@atls/nestjs-s3-client'

import type { FilesEngineInfrastructureModuleOptions } from './files-engine-infrastructure.module.interfaces.js'

import { Inject }                                      from '@nestjs/common'

import { FILES_ENGINE_INFRASTRUCTURE_MODULE_OPTIONS }  from './files-engine-infrastructure.module.contants.js'

export class FilesEngineInfrastructureModuleConfig {
  constructor(
    @Inject(FILES_ENGINE_INFRASTRUCTURE_MODULE_OPTIONS)
    private readonly options: FilesEngineInfrastructureModuleOptions
  ) {}

  get storage(): FilesEngineInfrastructureModuleOptions['storage'] {
    return (
      this.options.storage ||
      (process.env.FILES_STORAGE_PROVIDER as FilesEngineInfrastructureModuleOptions['storage']) ||
      's3'
    )
  }

  get events(): CqrsKafkaEventsModuleOptions {
    return this.options.events || {}
  }

  get gcs(): GcsClientModuleOptions {
    return this.options.gcs || {}
  }

  get s3(): S3ClientModuleOptions {
    return this.options.s3 || {}
  }

  get db(): Partial<MikroOrmModuleOptions> {
    return this.options.db || {}
  }
}
