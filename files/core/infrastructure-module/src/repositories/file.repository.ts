import { Injectable }       from '@nestjs/common'
import { EventPublisher }   from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository }       from 'typeorm'

import { File }             from '@files/domain-module'
import { FileRepository }   from '@files/domain-module'

import { FileAggregate }    from '../entities'

@Injectable()
export class FileRepositoryImpl extends FileRepository {
  constructor(
    @InjectRepository(FileAggregate) private readonly repository: Repository<FileAggregate>,
    private readonly eventPublisher: EventPublisher
  ) {
    super()
  }

  create(): File {
    return this.eventPublisher.mergeObjectContext(new File())
  }

  async save(aggregate: File): Promise<void> {
    await this.repository.save(this.aggregateToEntity(aggregate))

    aggregate.commit()
  }

  async findById(id: string): Promise<File | undefined> {
    const entity = await this.repository.findOne({ id })

    return entity ? this.entityToAggregate(entity) : undefined
  }

  private entityToAggregate(entity: FileAggregate): File {
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

  private aggregateToEntity(data: File): FileAggregate {
    return Object.assign(new FileAggregate(), data)
  }

  async findByQuery({ pager, order, query }) {
    const qb = await this.repository.createQueryBuilder('file')

    if (query?.id?.eq?.value) {
      qb.andWhere('file.id = :id', { id: query.id.eq.value })
    }

    if (query?.id?.in?.values && query?.id?.in?.values?.length > 0) {
      qb.andWhere('file.id IN (:...ids)', { ids: query.id.in.values })
    }

    if (order) {
      qb.orderBy(qb.escape(order.field), order.direction === 'ASC' ? 'ASC' : 'DESC')
    }

    qb.skip(pager?.offset || 0).take((pager?.take || 25) + 1)

    const files = await qb.getMany()

    return {
      files: files.map(this.entityToAggregate),
      hasNextPage: qb.expressionMap.take ? files.length >= qb.expressionMap.take : false,
    }
  }
}
