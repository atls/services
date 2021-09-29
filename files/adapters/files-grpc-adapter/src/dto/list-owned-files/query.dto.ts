import { ValidateNested }              from 'class-validator'
import { IsOptional }                  from 'class-validator'
import { Type }                        from 'class-transformer'

import { ListOwnedFilesRequest_Query } from '@atls/services-proto-files'

import { IdQueryDto }                  from './id-query.dto'

export class QueryDto implements ListOwnedFilesRequest_Query {
  @IsOptional()
  @ValidateNested()
  @Type(() => IdQueryDto)
  id?: IdQueryDto
}
