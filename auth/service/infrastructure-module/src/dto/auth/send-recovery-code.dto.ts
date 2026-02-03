import { IsEmail }    from 'class-validator'
import { IsString }   from 'class-validator'
import { IsNotEmpty } from 'class-validator'

export class SendRecoveryCodeDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string
}
