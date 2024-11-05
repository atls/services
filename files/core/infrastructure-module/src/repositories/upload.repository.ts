import { Injectable }           from '@nestjs/common'
import { EventPublisher }       from '@nestjs/cqrs'
import { InjectRepository }     from '@nestjs/typeorm'
import { Repository }           from 'typeorm'

import { FilesBucketsRegistry } from '@files/buckets-config-adapter-module'
import { Upload }               from '@files/domain-module'
import { UploadRepository }     from '@files/domain-module'
import { Storage }              from '@files/storage-adapter-module'

import { UploadAggregate }      from '../entities/index.js'

@Injectable()
export class UploadRepositoryImpl extends UploadRepository {
  constructor(
    @InjectRepository(UploadAggregate) private readonly repository: Repository<UploadAggregate>,
    private readonly eventPublisher: EventPublisher,
    private readonly registry: FilesBucketsRegistry,
    private readonly storage: Storage
  ) {
    super()
  }

  create(): Upload {
    return this.eventPublisher.mergeObjectContext(new Upload(this.registry, this.storage))
  }

  async save(aggregate: Upload): Promise<void> {
    await this.repository.save(this.aggregateToEntity(aggregate))

    aggregate.commit()
  }

  async findById(id: string): Promise<Upload | undefined> {
    const entity = await this.repository.findOne({ where: { id } })

    return entity ? this.entityToAggregate(entity) : undefined
  }

  private entityToAggregate(entity: UploadAggregate): Upload {
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

  private aggregateToEntity(data: Upload): UploadAggregate {
    return Object.assign(new UploadAggregate(), data)
  }
}
