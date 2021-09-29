import { IsIn }                                 from 'class-validator'
import { IsEnum }                               from 'class-validator'

import { ListOwnedFilesRequest_Order }          from '@atls/services-proto-files'
import { ListOwnedFilesRequest_OrderDirection } from '@atls/services-proto-files'

export class OrderDto implements ListOwnedFilesRequest_Order {
  @IsIn(['id'])
  field!: string

  @IsEnum(ListOwnedFilesRequest_OrderDirection)
  direction!: ListOwnedFilesRequest_OrderDirection
}
