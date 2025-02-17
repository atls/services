import { IQueryHandler }    from '@files/cqrs-adapter'
import { QueryHandler }     from '@files/cqrs-adapter'
import { FileRepository }   from '@files/domain-module'
import { File }             from '@files/domain-module'

import { QueryException }   from '../exceptions/index.js'
import { GetFileByIdQuery } from '../queries/index.js'

@QueryHandler(GetFileByIdQuery)
export class GetFileQueryHandler implements IQueryHandler<GetFileByIdQuery> {
  constructor(private readonly fileRepository: FileRepository) {}

  async execute(query: GetFileByIdQuery): Promise<File | undefined> {
    try {
      return this.fileRepository.findById(query.id)
    } catch (error) {
      throw new QueryException(GetFileQueryHandler.name, query, error)
    }
  }
}
