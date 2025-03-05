import { IQueryHandler }          from '@files/cqrs-adapter'
import { QueryHandler }           from '@files/cqrs-adapter'
import { FileRepository }         from '@files/domain-module'
import { FindFilesByQueryResult } from '@files/domain-module'

import { QueryException }         from '../exceptions/query.exception.js'
import { GetFilesQuery }          from '../queries/index.js'

@QueryHandler(GetFilesQuery)
export class GetFilesQueryHandler implements IQueryHandler<GetFilesQuery> {
  constructor(private readonly fileRepository: FileRepository) {}

  async execute(query: GetFilesQuery): Promise<FindFilesByQueryResult> {
    try {
      return this.fileRepository.findByQuery(query)
    } catch (error) {
      throw new QueryException(GetFilesQueryHandler.name, query, error)
    }
  }
}
