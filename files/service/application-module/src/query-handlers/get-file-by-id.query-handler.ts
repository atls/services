import type { File }          from '@files-engine/domain-module'
import type { IQueryHandler } from '@nestjs/cqrs'

import { QueryHandler }       from '@nestjs/cqrs'

import { FileRepository }     from '@files-engine/domain-module'

import { GetFileByIdQuery }   from '../queries/index.js'

@QueryHandler(GetFileByIdQuery)
export class GetFileQueryHandler implements IQueryHandler<GetFileByIdQuery> {
  constructor(private readonly fileRepository: FileRepository) {}

  async execute(query: GetFileByIdQuery): Promise<File | undefined> {
    return this.fileRepository.findById(query.id)
  }
}
