import { IsUUID }                         from 'class-validator'
import { IsOptional }                     from 'class-validator'

import { ListPublicFilesRequest_IdQuery } from '@atls/services-proto-files'

export class IdQueryDto implements ListPublicFilesRequest_IdQuery {
  @IsUUID('4')
  @IsOptional()
  eq?: string;

  @IsUUID('4', {
    each: true,
  })
  @IsOptional()
  in?: string[]
}
