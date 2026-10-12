import type { FilesBucket } from '@files-engine/domain-module'

import { BaseEntity }       from '@mikro-orm/core'
import { Entity }           from '@mikro-orm/decorators/legacy'
import { Property }         from '@mikro-orm/decorators/legacy'
import { PrimaryKey }       from '@mikro-orm/decorators/legacy'

@Entity({ tableName: 'uploads' })
export class UploadEntity extends BaseEntity {
  @PrimaryKey({ type: 'uuid' })
  id!: string

  @Property({ type: 'uuid' })
  ownerId!: string

  @Property({ type: 'jsonb' })
  bucket!: FilesBucket

  @Property()
  filename!: string

  @Property()
  contentType!: string

  @Property()
  name!: string

  @Property()
  size!: number

  @Property({ length: 2048 })
  url!: string

  @Property()
  confirmed!: boolean
}
