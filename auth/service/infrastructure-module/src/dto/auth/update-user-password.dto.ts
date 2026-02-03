import { IsString }   from 'class-validator'
import { IsNotEmpty } from 'class-validator'

export class UpdateUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  sessionToken: string
}
