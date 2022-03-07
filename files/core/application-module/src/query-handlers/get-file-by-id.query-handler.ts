import { IQueryHandler }    from '@nestjs/cqrs'
import { QueryHandler }     from '@nestjs/cqrs'

import { FileRepository }   from '@files/domain-module'

import { GetFileByIdQuery } from '../queries'

@QueryHandler(GetFileByIdQuery)
export class GetFileQueryHandler implements IQueryHandler<GetFileByIdQuery> {
  constructor(private readonly fileRepository: FileRepository) {}

  execute(query: GetFileByIdQuery) {
    return this.fileRepository.findById(query.id)
  }
}
