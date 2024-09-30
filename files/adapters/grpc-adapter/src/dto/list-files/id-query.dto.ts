import type { ListFilesRequest_IdQuery } from '@atls/services-proto-files'

import { Type }                          from 'class-transformer'
import { ValidateNested }                from 'class-validator'
import { IsOptional }                    from 'class-validator'

import { IdIncludeCondition }            from '../common'
import { IdEqualCondition }              from '../common'

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
