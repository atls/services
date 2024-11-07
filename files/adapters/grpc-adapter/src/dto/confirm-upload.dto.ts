import type { ConfirmUploadRequest } from '@atls/services-proto-upload'

import { IsNotEmpty }                from 'class-validator'

export class ConfirmUploadDto implements ConfirmUploadRequest {
  @IsNotEmpty()
  id!: string
}
