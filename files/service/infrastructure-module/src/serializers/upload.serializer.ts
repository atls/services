import type { Upload } from '@files-engine/domain-module'

import * as rpc        from '@files-engine/files-rpc/abstractions'

export class UploadSerializer extends rpc.Upload {
  constructor(private readonly upload: Upload) {
    super()
  }

  get id(): string {
    return this.upload.id
  }

  get url(): string {
    return this.upload.url
  }

  get ownerId(): string {
    return this.upload.ownerId
  }
}
