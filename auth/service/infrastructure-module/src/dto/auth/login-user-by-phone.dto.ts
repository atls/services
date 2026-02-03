import { IsString }      from 'class-validator'
import { IsPhoneNumber } from 'class-validator'
import { IsNotEmpty }    from 'class-validator'

export class LoginUserByPhoneDto {
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string
}
