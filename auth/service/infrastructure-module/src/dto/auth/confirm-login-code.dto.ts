import { IsString }   from 'class-validator'
import { IsUUID }     from 'class-validator'
import { IsNotEmpty } from 'class-validator'

export class ConfirmLoginCodeDto {
  @IsUUID()
  authProcessId: string

  @IsString()
  @IsNotEmpty()
  code: string

  @IsString()
  @IsNotEmpty()
  identifier: string
}
