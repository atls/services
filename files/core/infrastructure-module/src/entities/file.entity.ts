import { Column }          from 'typeorm'
import { Entity }          from 'typeorm'
import { PrimaryColumn }   from 'typeorm'

import { FilesBucketType } from '@files/domain-module'

@Entity('files')
export class FileAggregate {
  @PrimaryColumn('uuid')
  id!: string

  @Column('enum', {
    default: FilesBucketType.PRIVATE,
    enum: FilesBucketType,
  })
  type!: string

  @Column('uuid')
  ownerId!: string

  @Column()
  name!: string

  @Column()
  url!: string

  @Column()
  bucket!: string

  @Column()
  size!: number

  @Column({ nullable: true })
  contentType?: string

  @Column({ nullable: true })
  cacheControl?: string

  @Column({ nullable: true })
  contentDisposition?: string

  @Column({ nullable: true })
  contentEncoding?: string

  @Column({ nullable: true })
  contentLanguage?: string

  @Column('jsonb', { nullable: true, default: {} })
  metadata!: Record<string, string>
}
