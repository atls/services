import { BaseEntity }      from '@mikro-orm/core'
import { Entity }          from '@mikro-orm/decorators/legacy'
import { Property }        from '@mikro-orm/decorators/legacy'
import { PrimaryKey }      from '@mikro-orm/decorators/legacy'
import { Enum }            from '@mikro-orm/decorators/legacy'

import { FilesBucketType } from '@files-engine/domain-module'

@Entity({ tableName: 'files' })
export class FileEntity extends BaseEntity {
  @PrimaryKey({ type: 'uuid' })
  id!: string

  @Enum({ items: () => FilesBucketType, type: 'smallint', default: FilesBucketType.PRIVATE })
  type: FilesBucketType = FilesBucketType.PRIVATE

  @Property({ type: 'uuid' })
  ownerId!: string

  @Property({ length: 2048 })
  url!: string

  @Property()
  bucket!: string
}
