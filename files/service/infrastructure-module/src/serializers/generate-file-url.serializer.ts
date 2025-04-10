import { GenerateFileUrlResponse } from '@atls/files-rpc/abstractions'

export class GenerateFileUrlSerializer extends GenerateFileUrlResponse {
  constructor(private readonly result: string) {
    super()
  }

  get url(): string {
    return this.result
  }
}
