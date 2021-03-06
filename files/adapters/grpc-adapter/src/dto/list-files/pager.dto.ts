import { IsInt }                  from 'class-validator'
import { Min }                    from 'class-validator'
import { Max }                    from 'class-validator'

import { ListFilesRequest_Pager } from '@atls/services-proto-files'

export class PagerDto implements ListFilesRequest_Pager {
  @IsInt()
  @Min(0)
  offset!: number

  @IsInt()
  @Min(0)
  @Max(1000)
  take!: number
}
