import { InjectRepository }    from '@typa/common'
import { Repository }          from 'typeorm'

import { Query }               from '@typa/common'
import { QueryHandler }        from '@typa/common'
import { FilesBucketType }     from '@files/domain-module'
import { GetFileByIdQuery }    from '@files/domain-module'
import { GetPublicFilesQuery } from '@files/domain-module'
import { GetOwnedFilesQuery }  from '@files/domain-module'

import { FileEntity }          from '../entities'

export class FilesQueryHandler {
  @InjectRepository(FileEntity)
  private readonly repository!: Repository<FileEntity>

  @QueryHandler(GetFileByIdQuery)
  getFileById(@Query query: GetFileByIdQuery) {
    return this.repository.findOne(query.id)
  }

  @QueryHandler(GetOwnedFilesQuery)
  async getOwnedFilesQuery(@Query query: GetOwnedFilesQuery) {
    const qb = await this.repository.createQueryBuilder('file')

    if (query.query?.id?.eq) {
      qb.andWhere('file.id = :id', { id: query.query.id.eq })
    }

    const idIn = (query.query?.id?.in || []).filter(Boolean)

    if (Array.isArray(idIn) && idIn.length > 0) {
      qb.andWhere('file.id IN (:...ids)', { ids: query.query.id.in })
    }

    qb.andWhere('file."ownerId" = :owner', { owner: query.ownerId })

    if (query.order) {
      qb.orderBy(qb.escape(query.order.field), query.order.direction === 0 ? 'ASC' : 'DESC')
    }

    qb.skip(query.pager?.offset || 0).take((query.pager?.take || 25) + 1)

    const files = await qb.getMany()

    return {
      files,
      hasNextPage: qb.expressionMap.take ? files.length >= qb.expressionMap.take : false,
    }
  }

  @QueryHandler(GetPublicFilesQuery)
  async getPublicFilesQuery(@Query query: GetPublicFilesQuery) {
    const qb = await this.repository.createQueryBuilder('file')

    if (query.query?.id?.eq) {
      qb.andWhere('file.id = :id', { id: query.query.id.eq })
    }

    const idIn = (query.query?.id?.in || []).filter(Boolean)

    if (Array.isArray(idIn) && idIn.length > 0) {
      qb.andWhere('file.id IN (:...ids)', { ids: query.query.id.in })
    }

    qb.andWhere('file."type" = :type', { type: FilesBucketType.PUBLIC })

    if (query.order) {
      qb.orderBy(qb.escape(query.order.field), query.order.direction === 0 ? 'ASC' : 'DESC')
    }

    qb.skip(query.pager?.offset || 0).take((query.pager?.take || 25) + 1)

    const files = await qb.getMany()

    return {
      files,
      hasNextPage: qb.expressionMap.take ? files.length >= qb.expressionMap.take : false,
    }
  }
}
