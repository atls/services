import { IsString }   from 'class-validator'
import { IsUUID }     from 'class-validator'
import { IsNotEmpty } from 'class-validator'

export class ConfirmVerificationCodeDto {
  @IsUUID()
  authProcessId: string

  @IsString()
  @IsNotEmpty()
  code: string
}
