import type { EntityDTO }  from '@mikro-orm/core'

import { Entity }          from '@mikro-orm/core'
import { Enum }            from '@mikro-orm/core'
import { PrimaryKey }      from '@mikro-orm/core'
import { Property }        from '@mikro-orm/core'
import { v4 as uuid }      from 'uuid'

import { FilesBucketType } from '@files/domain-module'

export type FileEntityDTO = EntityDTO<FileEntity>

@Entity({ tableName: 'files' })
export class FileEntity {
  @PrimaryKey({ autoincrement: false, type: 'uuid' })
  id: string = uuid()

  @Property()
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  @Enum({ items: () => FilesBucketType, default: FilesBucketType.PRIVATE })
  type: FilesBucketType

  @Property({ type: 'uuid' })
  ownerId: string

  @Property()
  name: string

  @Property()
  url: string

  @Property()
  bucket: string

  @Property()
  size: number

  @Property({ nullable: true })
  contentType?: string

  @Property({ nullable: true })
  cacheControl?: string

  @Property({ nullable: true })
  contentDisposition?: string

  @Property({ nullable: true })
  contentEncoding?: string

  @Property({ nullable: true })
  contentLanguage?: string

  @Property({ type: 'jsonb', nullable: true, default: '{}' })
  metadata: Record<string, string>
}
