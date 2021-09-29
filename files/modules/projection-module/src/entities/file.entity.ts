import { Column }           from 'typeorm'
import { Entity }           from 'typeorm'
import { PrimaryColumn }    from 'typeorm'
import { CreateDateColumn } from 'typeorm'
import { UpdateDateColumn } from 'typeorm'

import { FilesBucketType }  from '@files/domain-module'

@Entity('files')
export class FileEntity {
  @PrimaryColumn('uuid')
  id!: string

  @Column('enum', {
    default: FilesBucketType.PRIVATE,
    enum: FilesBucketType,
  })
  type!: string

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
  metadata!: { [key: string]: string }

  @Column('uuid', {
    default: '36262472-e3f4-4327-a700-9041c24dd12b',
  })
  ownerId!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
