import { IQueryHandler }      from '@files/cqrs-adapter'
import { QueryHandler }       from '@files/cqrs-adapter'
import { UploadRepository }   from '@files/domain-module'
import { Upload }             from '@files/domain-module'

import { GetUploadByIdQuery } from '../queries/index.js'

@QueryHandler(GetUploadByIdQuery)
export class GetUploadQueryHandler implements IQueryHandler<GetUploadByIdQuery> {
  constructor(private readonly uploadRepository: UploadRepository) {}

  async execute(query: GetUploadByIdQuery): Promise<Upload | undefined> {
    return this.uploadRepository.findById(query.id)
  }
}
