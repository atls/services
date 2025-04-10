import type { ExtractProperties } from '@atls/base-types'

import type { FileEntity }        from '../entities/index.js'

import { Injectable }             from '@nestjs/common'

import { File }                   from '@files-engine/domain-module'

@Injectable()
export class FileMapper {
  toDomain(entity: FileEntity): File {
    const properties: Omit<ExtractProperties<File>, 'autoCommit'> = {
      id: entity.id,
      ownerId: entity.ownerId,
      type: entity.type,
      url: entity.url,
      bucket: entity.bucket,
    }

    return Object.assign(new File(), properties)
  }

  toPersistence(aggregate: File, entity: FileEntity): FileEntity {
    entity.assign({
      id: aggregate.id,
      ownerId: aggregate.ownerId,
      type: aggregate.type,
      url: aggregate.url,
      bucket: aggregate.bucket,
    })

    return entity
  }
}
