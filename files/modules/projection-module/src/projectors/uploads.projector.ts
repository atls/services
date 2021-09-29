import { Injectable }         from '@nestjs/common'
import { InjectRepository }   from '@typa/common'
import { Repository }         from 'typeorm'

import { Event }              from '@typa/common'
import { EventHandler }       from '@typa/common'
import { UploadCreatedEvent } from '@files/domain-module'

import { UploadEntity }       from '../entities'

@Injectable()
export class UploadsProjector {
  @InjectRepository(UploadEntity)
  private readonly repository!: Repository<UploadEntity>

  @EventHandler(UploadCreatedEvent)
  async onUploadCreated(@Event event: UploadCreatedEvent) {
    await this.repository.save(
      this.repository.create({
        id: event.uploadId,
        ownerId: event.ownerId,
        url: event.url,
        name: event.name,
        filename: event.filename,
        bucket: event.bucket,
      })
    )
  }
}
