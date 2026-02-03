import { IsEmail }    from 'class-validator'
import { IsString }   from 'class-validator'
import { IsNotEmpty } from 'class-validator'

export class UpdateUserEmailDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  sessionToken: string
}
