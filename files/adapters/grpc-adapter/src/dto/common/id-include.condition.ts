import { IsUUID }     from 'class-validator'
import { IsOptional } from 'class-validator'

export class IdIncludeCondition {
  @IsUUID('4', {
    each: true,
  })
  @IsOptional()
  values!: Array<string>
}
