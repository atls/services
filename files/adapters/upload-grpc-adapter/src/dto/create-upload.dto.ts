import { IsNotEmpty }          from 'class-validator'
import { IsInt }               from 'class-validator'
import { Min }                 from 'class-validator'

import { CreateUploadRequest } from '@atls/services-proto-files'

export class CreateUploadDto implements CreateUploadRequest {
  @IsNotEmpty()
  bucket!: string

  @IsNotEmpty()
  name!: string

  @IsInt()
  @Min(1)
  size!: number
}
