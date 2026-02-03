import { IsEmail }    from 'class-validator'
import { IsString }   from 'class-validator'
import { IsNotEmpty } from 'class-validator'

export class RegisterUserByEmailDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}
