import { IsString }   from 'class-validator'
import { IsNotEmpty } from 'class-validator'

export class GetUserAccountDto {
  @IsString()
  @IsNotEmpty()
  sessionToken: string
}
