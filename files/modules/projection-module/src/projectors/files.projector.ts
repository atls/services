import { Injectable }           from '@nestjs/common'
import { InjectRepository }     from '@typa/common'
import { Repository }           from 'typeorm'

import { Event }                from '@typa/common'
import { EventHandler }         from '@typa/common'
import { UploadConfirmedEvent } from '@files/domain-module'

import { FileEntity }           from '../entities'

@Injectable()
export class FilesProjector {
  @InjectRepository(FileEntity)
  private readonly repository!: Repository<FileEntity>

  @EventHandler(UploadConfirmedEvent)
  async onUploadConfirmed(@Event event: UploadConfirmedEvent) {
    await this.repository.save(
      this.repository.create({
        id: event.uploadId,
        ownerId: event.ownerId,
        type: event.type,
        url: event.url,
        name: event.name,
        bucket: event.bucket,
        size: event.size,
        contentType: event.contentType,
        cacheControl: event.cacheControl,
        contentDisposition: event.contentDisposition,
        contentEncoding: event.contentEncoding,
        contentLanguage: event.contentLanguage,
        metadata: event.metadata,
      })
    )
  }
}
