import type { Upload }          from '@files-engine/domain-module'

import { CreateUploadResponse } from '@files-engine/files-rpc/abstractions'

import { UploadSerializer }     from './upload.serializer.js'

export class CreateUploadSerializer extends CreateUploadResponse {
  constructor(private readonly upload: Upload) {
    super()
  }

  get result(): UploadSerializer {
    return new UploadSerializer(this.upload)
  }
}
