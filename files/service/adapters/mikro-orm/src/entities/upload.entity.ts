import type { FilesBucket } from '@files/domain-module'
import type { EntityDTO }   from '@mikro-orm/core'

import { Entity }           from '@mikro-orm/core'
import { PrimaryKey }       from '@mikro-orm/core'
import { Property }         from '@mikro-orm/core'
import { v4 as uuid }       from 'uuid'

export type UploadDTO = EntityDTO<UploadEntity>

@Entity({ tableName: 'uploads' })
export class UploadEntity {
  @PrimaryKey({ autoincrement: false, type: 'uuid' })
  id: string = uuid()

  @Property()
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  @Property({ type: 'uuid' })
  ownerId: string

  @Property()
  url: string

  @Property()
  name: string

  @Property()
  filename: string

  @Property({ type: 'jsonb' })
  bucket: FilesBucket

  @Property()
  confirmed: boolean
}
