import { IsString }   from 'class-validator'
import { IsUUID }     from 'class-validator'
import { IsOptional } from 'class-validator'
import { IsEmail }    from 'class-validator'
import { IsNotEmpty } from 'class-validator'

export class LoginUserByEmailDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsOptional()
  @IsUUID()
  authProcessId?: string
}
