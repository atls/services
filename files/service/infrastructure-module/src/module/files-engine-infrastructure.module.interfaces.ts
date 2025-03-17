import type { CqrsKafkaEventsModuleOptions } from '@atls/nestjs-cqrs-kafka-events'
import type { GcsClientModuleOptions }       from '@atls/nestjs-gcs-client'
import type { S3ClientModuleOptions }        from '@atls/nestjs-s3-client'
import type { MikroOrmModuleOptions }        from '@mikro-orm/nestjs'

export interface FilesEngineInfrastructureModuleOptions {
  storage?: 'gcs' | 's3'
  events?: CqrsKafkaEventsModuleOptions
  gcs?: GcsClientModuleOptions
  s3?: S3ClientModuleOptions
  db?: Partial<MikroOrmModuleOptions>
}
