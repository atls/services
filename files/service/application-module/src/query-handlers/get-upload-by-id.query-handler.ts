import type { Upload }        from '@files-engine/domain-module'
import type { IQueryHandler } from '@nestjs/cqrs'

import { QueryHandler }       from '@nestjs/cqrs'

import { UploadRepository }   from '@files-engine/domain-module'

import { GetUploadByIdQuery } from '../queries/index.js'

@QueryHandler(GetUploadByIdQuery)
export class GetUploadQueryHandler implements IQueryHandler<GetUploadByIdQuery> {
  constructor(private readonly uploadRepository: UploadRepository) {}

  async execute(query: GetUploadByIdQuery): Promise<Upload | undefined> {
    return this.uploadRepository.findById(query.id)
  }
}
