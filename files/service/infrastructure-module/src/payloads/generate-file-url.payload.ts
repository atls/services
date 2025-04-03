import type { GenerateFileUrlRequest } from '@atls/files-rpc/interfaces'

import { IsUUID }                      from 'class-validator'

export class GenerateFileUrlPayload {
  constructor(private readonly request: GenerateFileUrlRequest) {}

  @IsUUID('4')
  get id(): string {
    return this.request.id
  }
}
