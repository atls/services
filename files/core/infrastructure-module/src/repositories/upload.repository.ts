import type { UploadRepository } from '@files/domain-module'

import { Injectable }            from '@nestjs/common'

import { FilesBucketsRegistry }  from '@files/buckets-config-adapter'
import { EventPublisher }        from '@files/cqrs-adapter'
import { FindException }         from '@files/domain-module'
import { SaveException }         from '@files/domain-module'
import { Upload }                from '@files/domain-module'
import { MikroORM }              from '@files/mikro-orm-adapter'
import { UploadEntity }          from '@files/mikro-orm-adapter'
import { Storage }               from '@files/storage-adapter'

@Injectable()
export class UploadRepositoryImpl implements UploadRepository {
  constructor(
    private readonly orm: MikroORM,
    private readonly eventPublisher: EventPublisher,
    private readonly registry: FilesBucketsRegistry,
    private readonly storage: Storage
  ) {}

  create(): Upload {
    return this.eventPublisher.mergeObjectContext(new Upload(this.registry, this.storage))
  }

  async findById(id: string): Promise<Upload | undefined> {
    try {
      const fork = this.orm.em.fork()

      const entity = await fork.findOne(UploadEntity, { id })

      return entity ? this.entityToAggregate(entity) : undefined
    } catch (error) {
      throw new FindException('UploadRepository', { id }, error)
    }
  }

  async save(aggregate: Upload): Promise<void> {
    try {
      const fork = this.orm.em.fork()

      await fork.upsert(UploadEntity, this.aggregateToEntity(aggregate))

      aggregate.commit()
    } catch (error) {
      throw new SaveException('UploadRepository', aggregate, error)
    }
  }

  private aggregateToEntity(aggregate: Upload): UploadEntity {
    return Object.assign(new UploadEntity(), aggregate.properties)
  }

  private entityToAggregate(entity: UploadEntity): Upload {
    const upload = new Upload(this.registry, this.storage)

    return Object.assign(upload, {
      id: entity.id,
      ownerId: entity.ownerId,
      url: entity.url,
      name: entity.name,
      filename: entity.filename,
      bucket: entity.bucket,
      confirmed: entity.confirmed,
    })
  }
}
