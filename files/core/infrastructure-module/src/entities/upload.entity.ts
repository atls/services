import { Column }        from 'typeorm'
import { Entity }        from 'typeorm'
import { PrimaryColumn } from 'typeorm'

import { FilesBucket }   from '@files/domain-module'

@Entity()
export class UploadAggregate {
  @PrimaryColumn('uuid')
  id!: string

  @Column('uuid')
  ownerId!: string

  @Column()
  url!: string

  @Column()
  name!: string

  @Column()
  filename!: string

  @Column('jsonb')
  bucket!: FilesBucket

  @Column()
  confirmed!: boolean
}
