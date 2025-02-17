import { Type }             from 'class-transformer'
import { ValidateNested }   from 'class-validator'
import { IsOptional }       from 'class-validator'

import { ListFilesRequest } from '@atls/services-proto-files'

import { OrderDto }         from './order.dto.js'
import { PagerDto }         from './pager.dto.js'
import { QueryDto }         from './query.dto.js'

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
