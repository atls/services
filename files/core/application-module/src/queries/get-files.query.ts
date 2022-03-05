import { FilesPager } from '@files/domain-module'
import { FilesOrder } from '@files/domain-module'
import { FilesQuery } from '@files/domain-module'

export class GetFilesQuery {
  constructor(
    public readonly pager: FilesPager = { take: 100, offset: 0 },
    public readonly order?: FilesOrder,
    public readonly query?: FilesQuery
  ) {}
}
