import { IsEmail }    from 'class-validator'
import { IsString }   from 'class-validator'
import { IsNotEmpty } from 'class-validator'

export class SendVerificationCodeDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string
}
