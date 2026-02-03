import { IsString }   from 'class-validator'
import { IsNotEmpty } from 'class-validator'

export class DeleteUserAccountDto {
  @IsString()
  @IsNotEmpty()
  accountId: string
}
