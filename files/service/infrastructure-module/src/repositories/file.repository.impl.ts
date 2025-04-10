import type { RecordMetadata }                      from '@atls/nestjs-cqrs-kafka-events'
import type { File }                                from '@files-engine/domain-module'
import type { FindFilesByQueryResult }              from '@files-engine/domain-module'
import type { FindFilesByQuery }                    from '@files-engine/domain-module'
import type { IEvent }                              from '@nestjs/cqrs'

import { MikroORMQueryBuilder }                     from '@atls/mikro-orm-query-builder'
import { EntityRepository }                         from '@mikro-orm/core'
import { EntityManager }                            from '@mikro-orm/core'
import { InjectRepository }                         from '@mikro-orm/nestjs'
import { EntityManager as PostgreSqlEntityManager } from '@mikro-orm/postgresql'
import { Injectable }                               from '@nestjs/common'
import { Inject }                                   from '@nestjs/common'
import { EventBus }                                 from '@nestjs/cqrs'

import { FileRepository }                           from '@files-engine/domain-module'

import { FileEntity }                               from '../entities/index.js'
import { FileMapper }                               from '../mappers/index.js'

@Injectable()
export class FileRepositoryImpl extends FileRepository {
  constructor(
    @InjectRepository(FileEntity)
    private readonly repository: EntityRepository<FileEntity>,
    @Inject(EntityManager)
    private readonly em: PostgreSqlEntityManager,
    private readonly eventBus: EventBus,
    private readonly mapper: FileMapper
  ) {
    super()
  }

  async save(aggregate: File): Promise<void> {
    const exists = (await this.repository.findOne(aggregate.id)) || new FileEntity()

    const em = this.em.fork()

    await em.begin()

    try {
      em.persist(this.mapper.toPersistence(aggregate, exists))

      if (aggregate.getUncommittedEvents().length > 0) {
        await this.eventBus.publishAll<IEvent, Promise<Array<RecordMetadata>>>(
          aggregate.getUncommittedEvents()
        )
      }

      aggregate.commit()

      await em.commit()
    } catch (error) {
      await em.rollback()

      throw error
    }
  }

  async findById(id: string): Promise<File | undefined> {
    const entity = await this.repository.findOne({
      id,
    })

    return entity ? this.mapper.toDomain(entity) : undefined
  }

  async findByQuery({ pager, order, query }: FindFilesByQuery): Promise<FindFilesByQueryResult> {
    const [files, hasNextPage] = await new MikroORMQueryBuilder<FileEntity>(
      this.em.createQueryBuilder(FileEntity)
    )
      .id('id', query?.id)
      .id('ownerId', query?.ownerId)
      .order(order)
      .pager(pager)
      .execute()

    return {
      files: files.map((file) => this.mapper.toDomain(file)),
      hasNextPage,
    }
  }
}
