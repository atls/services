import { IQueryHandler }      from '@nestjs/cqrs'
import { QueryHandler }       from '@nestjs/cqrs'

import { UploadRepository }   from '@files/domain-module'

import { GetUploadByIdQuery } from '../queries'

@QueryHandler(GetUploadByIdQuery)
export class GetUploadQueryHandler implements IQueryHandler<GetUploadByIdQuery> {
  constructor(private readonly uploadRepository: UploadRepository) {}

  execute(query: GetUploadByIdQuery) {
    return this.uploadRepository.findById(query.id)
  }
}
