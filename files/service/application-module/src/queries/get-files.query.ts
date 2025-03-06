import type { FindFilesByQuery } from '@files-engine/domain-module'

export class GetFilesQuery {
  constructor(
    public readonly pager: FindFilesByQuery['pager'],
    public readonly order?: FindFilesByQuery['order'],
    public readonly query?: FindFilesByQuery['query']
  ) {}
}
