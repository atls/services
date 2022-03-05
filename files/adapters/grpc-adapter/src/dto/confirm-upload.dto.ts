import { IsNotEmpty }           from 'class-validator'

import { ConfirmUploadRequest } from '@atls/services-proto-upload'

export class ConfirmUploadDto implements ConfirmUploadRequest {
  @IsNotEmpty()
  id!: string
}
