import { InjectRepository }    from '@typa/common'
import { Repository }          from 'typeorm'

import { Query, QueryHandler } from '@typa/common'
import { GetUploadByIdQuery }  from '@files/domain-module'

import { UploadEntity }        from '../entities'

export class UploadsQueryHandler {
  @InjectRepository(UploadEntity)
  private readonly repository!: Repository<UploadEntity>

  @QueryHandler(GetUploadByIdQuery)
  getUploadById(@Query query: GetUploadByIdQuery) {
    return this.repository.findOne(query.id)
  }
}
