import { IsIn }                                  from 'class-validator'
import { IsEnum }                                from 'class-validator'

import { ListPublicFilesRequest_Order }          from '@atls/services-proto-files'
import { ListPublicFilesRequest_OrderDirection } from '@atls/services-proto-files'

export class OrderDto implements ListPublicFilesRequest_Order {
  @IsIn(['id'])
  field!: string

  @IsEnum(ListPublicFilesRequest_OrderDirection)
  direction!: ListPublicFilesRequest_OrderDirection
}
