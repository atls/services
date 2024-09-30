import { Transform }                       from 'class-transformer'
import { IsIn }                            from 'class-validator'

import { ListFilesRequest_OrderDirection } from '@atls/services-proto-files'

export class OrderDto {
  @IsIn(['id'])
  field!: string

  @Transform(
    ({ value }) =>
      value === ListFilesRequest_OrderDirection.ORDER_DIRECTION_ASC_UNSPECIFIED ? 'ASC' : 'DESC',
    { toClassOnly: true }
  )
  // direction!: 'ASC' | 'DESC' | ListFilesRequest_OrderDirection
  direction!: ListFilesRequest_OrderDirection | 'ASC' | 'DESC'
}
