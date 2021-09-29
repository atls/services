import { Inject }                          from '@nestjs/common'
import { EntitySubscriberInterface }       from 'typeorm'
import { EventSubscriber }                 from 'typeorm'
import { Connection }                      from 'typeorm'

import { FilesBucketType }                 from '@files/domain-module'

import { FILES_PROJECTION_MODULE_OPTIONS } from '../module'
import { FilesProjectionModuleOptions }    from '../module'
import { FileEntity }                      from '../entities'

@EventSubscriber()
export class FileEntitySubscriber implements EntitySubscriberInterface<FileEntity> {
  constructor(
    connection: Connection,
    @Inject(FILES_PROJECTION_MODULE_OPTIONS) private readonly options: FilesProjectionModuleOptions
  ) {
    connection.subscribers.push(this)
  }

  listenTo() {
    return FileEntity
  }

  async afterLoad(entity: FileEntity) {
    if (entity.type === FilesBucketType.PRIVATE) {
      // eslint-disable-next-line no-param-reassign
      entity.url = await this.options.storage.generateReadUrl(entity.bucket, entity.name)
    }
  }
}
