import { ValidateNested }               from 'class-validator'
import { IsOptional }                   from 'class-validator'
import { Type }                         from 'class-transformer'

import { ListPublicFilesRequest_Query } from '@atls/services-proto-files'

import { IdQueryDto }                   from './id-query.dto'

export class QueryDto implements ListPublicFilesRequest_Query {
  @IsOptional()
  @ValidateNested()
  @Type(() => IdQueryDto)
  id?: IdQueryDto
}
