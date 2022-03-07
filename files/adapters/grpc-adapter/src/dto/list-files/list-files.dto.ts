import { Type }             from 'class-transformer'
import { ValidateNested }   from 'class-validator'
import { IsOptional }       from 'class-validator'

import { ListFilesRequest } from '@atls/services-proto-files'

import { OrderDto }         from './order.dto'
import { PagerDto }         from './pager.dto'
import { QueryDto }         from './query.dto'

export class ListFilesDto implements Omit<ListFilesRequest, 'order'> {
  @IsOptional()
  @ValidateNested()
  @Type(() => PagerDto)
  pager?: PagerDto

  @IsOptional()
  @ValidateNested()
  @Type(() => QueryDto)
  query?: QueryDto

  @IsOptional()
  @ValidateNested()
  @Type(() => OrderDto)
  order?: OrderDto
}
