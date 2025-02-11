import type { FindFilesByQuery }       from '@files/domain-module'
import type { FindFilesByQueryResult } from '@files/domain-module'
import type { FileRepository }         from '@files/domain-module'

import { Injectable }                  from '@nestjs/common'

import { EventPublisher }              from '@files/cqrs-adapter'
import { FindException }               from '@files/domain-module'
import { SaveException }               from '@files/domain-module'
import { File }                        from '@files/domain-module'
import { FilterQuery }                 from '@files/mikro-orm-adapter'
import { MikroORM }                    from '@files/mikro-orm-adapter'
import { FileEntity }                  from '@files/mikro-orm-adapter'

@Injectable()
export class FileRepositoryImpl implements FileRepository {
  constructor(
    private readonly orm: MikroORM,
    private readonly eventPublisher: EventPublisher
  ) {}

  create(): File {
    return this.eventPublisher.mergeObjectContext(new File())
  }

  async findById(id: string): Promise<File | undefined> {
    try {
      const fork = this.orm.em.fork()

      const entity = await fork.findOne(FileEntity, { id })

      return entity ? this.entityToAggregate(entity) : undefined
    } catch (error) {
      throw new FindException('FileRepository', { id }, error)
    }
  }

  async findByQuery({ pager, order, query }: FindFilesByQuery): Promise<FindFilesByQueryResult> {
    try {
      const fork = this.orm.em.fork()

      let where: FilterQuery<FileEntity> = {}

      if (query?.id?.eq?.value && typeof query.id.eq.value === 'string') {
        where = { id: { $like: `%${query.id.eq.value}%` } }
      } else if (query?.id?.in?.values && Array.isArray(query.id.in.values)) {
        where = { id: { $in: query.id.in.values } }
      }

      const [entities, count] = await fork.findAndCount(FileEntity, where, {
        limit: pager.take,
        offset: pager.offset,
        orderBy: order ? { [order.field]: order.direction } : undefined,
      })

      return {
        files: this.entitiesToAggregates(entities),
        hasNextPage: count >= pager.take + pager.offset,
      }
    } catch (error) {
      throw new FindException('FileRepository', { pager, order, query }, error)
    }
  }

  async save(aggregate: File): Promise<void> {
    try {
      const fork = this.orm.em.fork()

      await fork.upsert(FileEntity, this.aggregateToEntity(aggregate))

      aggregate.commit()
    } catch (error) {
      throw new SaveException('FileRepository', aggregate, error)
    }
  }

  private aggregateToEntity(aggregate: File): FileEntity {
    return Object.assign(new FileEntity(), aggregate.properties)
  }

  private entityToAggregate(entity: FileEntity): File {
    const file = new File()

    return Object.assign(file, {
      id: entity.id,
      type: entity.type,
      url: entity.url,
      ownerId: entity.ownerId,
      name: entity.name,
      bucket: entity.bucket,
      size: entity.size,
      contentType: entity.contentType,
      cacheControl: entity.cacheControl,
      contentDisposition: entity.contentDisposition,
      contentEncoding: entity.contentEncoding,
      contentLanguage: entity.contentLanguage,
      metadata: entity.metadata,
    })
  }

  private entitiesToAggregates(entities: Array<FileEntity>): Array<File> {
    return entities.map((entity) => this.entityToAggregate(entity))
  }
}
