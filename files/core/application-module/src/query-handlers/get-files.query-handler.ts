import { IQueryHandler }          from '@files/cqrs-adapter'
import { QueryHandler }           from '@files/cqrs-adapter'
import { FileRepository }         from '@files/domain-module'
import { FindFilesByQueryResult } from '@files/domain-module'

import { GetFilesQuery }          from '../queries/index.js'

@QueryHandler(GetFilesQuery)
export class GetFilesQueryHandler implements IQueryHandler<GetFilesQuery> {
  constructor(private readonly fileRepository: FileRepository) {}

  async execute({ pager, order, query }: GetFilesQuery): Promise<FindFilesByQueryResult> {
    return this.fileRepository.findByQuery({
      pager,
      order,
      query,
    })
  }
}
