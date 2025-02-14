import { IQueryHandler }      from '@files/cqrs-adapter'
import { QueryHandler }       from '@files/cqrs-adapter'
import { UploadRepository }   from '@files/domain-module'
import { Upload }             from '@files/domain-module'

import { QueryException }     from '../exceptions/query.exception.js'
import { GetUploadByIdQuery } from '../queries/index.js'

@QueryHandler(GetUploadByIdQuery)
export class GetUploadQueryHandler implements IQueryHandler<GetUploadByIdQuery> {
  constructor(private readonly uploadRepository: UploadRepository) {}

  async execute(query: GetUploadByIdQuery): Promise<Upload | undefined> {
    try {
      return this.uploadRepository.findById(query.id)
    } catch (error) {
      throw new QueryException(GetUploadQueryHandler.name, query, error)
    }
  }
}
