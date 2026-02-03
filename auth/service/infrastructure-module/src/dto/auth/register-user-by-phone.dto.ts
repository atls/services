import { IsPhoneNumber } from 'class-validator'
import { IsString }      from 'class-validator'
import { IsNotEmpty }    from 'class-validator'

export class RegisterUserByPhoneDto {
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string
}
