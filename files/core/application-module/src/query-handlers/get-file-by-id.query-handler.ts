import { IQueryHandler }    from '@files/cqrs-adapter'
import { QueryHandler }     from '@files/cqrs-adapter'
import { FileRepository }   from '@files/domain-module'
import { File }             from '@files/domain-module'

import { GetFileByIdQuery } from '../queries/index.js'

@QueryHandler(GetFileByIdQuery)
export class GetFileQueryHandler implements IQueryHandler<GetFileByIdQuery> {
  constructor(private readonly fileRepository: FileRepository) {}

  async execute(query: GetFileByIdQuery): Promise<File | undefined> {
    return this.fileRepository.findById(query.id)
  }
}
