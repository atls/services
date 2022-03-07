import { IQueryHandler }  from '@nestjs/cqrs'
import { QueryHandler }   from '@nestjs/cqrs'

import { FileRepository } from '@files/domain-module'

import { GetFilesQuery }  from '../queries'

@QueryHandler(GetFilesQuery)
export class GetFilesQueryHandler implements IQueryHandler<GetFilesQuery> {
  constructor(private readonly fileRepository: FileRepository) {}

  execute({ pager, order, query }: GetFilesQuery) {
    return this.fileRepository.findByQuery({
      pager,
      order,
      query,
    })
  }
}
