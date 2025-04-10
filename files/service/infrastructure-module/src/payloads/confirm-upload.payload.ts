import type { ConfirmUploadRequest } from '@atls/files-rpc/interfaces'

import { IsUUID }                    from 'class-validator'

export class ConfirmUploadPayload {
  constructor(private readonly request: ConfirmUploadRequest) {}

  @IsUUID('4')
  get id(): string {
    return this.request.id
  }

  @IsUUID('4')
  get ownerId(): string {
    return this.request.ownerId
  }
}
