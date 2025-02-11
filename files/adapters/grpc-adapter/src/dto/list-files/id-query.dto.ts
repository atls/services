import { Type }                     from 'class-transformer'
import { ValidateNested }           from 'class-validator'
import { IsOptional }               from 'class-validator'

import { ListFilesRequest_IdQuery } from '@atls/services-proto-files'

import { IdIncludeCondition }       from '../common/index.js'
import { IdEqualCondition }         from '../common/index.js'

export class IdQueryDto implements ListFilesRequest_IdQuery {
  @IsOptional()
  @ValidateNested()
  @Type(() => IdEqualCondition)
  eq?: IdEqualCondition;

  @IsOptional()
  @ValidateNested()
  @Type(() => IdIncludeCondition)
  in?: IdIncludeCondition
}
