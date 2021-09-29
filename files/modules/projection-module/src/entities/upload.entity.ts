import { Column }           from 'typeorm'
import { Entity }           from 'typeorm'
import { PrimaryColumn }    from 'typeorm'
import { CreateDateColumn } from 'typeorm'
import { UpdateDateColumn } from 'typeorm'

import { FilesBucket }      from '@files/domain-module'

@Entity('uploads')
export class UploadEntity {
  @PrimaryColumn('uuid')
  id!: string

  @Column('jsonb')
  bucket!: FilesBucket

  @Column()
  url!: string

  @Column()
  name!: string

  @Column()
  filename!: string

  @Column('uuid', {
    default: '36262472-e3f4-4327-a700-9041c24dd12b',
  })
  ownerId!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
