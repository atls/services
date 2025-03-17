import type { FilesBucket }    from '@files-engine/domain-module'

import { Injectable }          from '@nestjs/common'

import { FilesBucketsAdapter } from '@files-engine/domain-module'

@Injectable()
export class StaticFilesBucketsAdapterImpl extends FilesBucketsAdapter {
  #buckets: Array<FilesBucket>

  constructor(buckets: Array<FilesBucket>) {
    super()

    this.#buckets = buckets
  }

  override toFilesBucket(name: string): FilesBucket | undefined {
    return this.#buckets.find((bucket) => bucket.name === name)
  }
}
