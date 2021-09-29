import { ValidateNested }         from 'class-validator'
import { IsOptional }             from 'class-validator'
import { Type }                   from 'class-transformer'

import { ListPublicFilesRequest } from '@atls/services-proto-files'

import { PagerDto }               from './pager.dto'
import { OrderDto }               from './order.dto'
import { QueryDto }               from './query.dto'

export class ListPublicFilesDto implements ListPublicFilesRequest {
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
