import { IsUUID }     from 'class-validator'
import { IsOptional } from 'class-validator'

export class IdEqualCondition {
  @IsUUID('4')
  @IsOptional()
  value!: string
}
