import { Injectable }                             from '@nestjs/common'
import { Inject }                                 from '@nestjs/common'

import { FilesBucket }                            from '@files/domain-module'
import { FilesBucketsRegistryPort }               from '@files/domain-module'

import { FILES_BUCKETS_MODULE_OPTIONS }           from '../module'
import { FilesBucketsConfigAdapterModuleOptions } from '../module'

@Injectable()
export class FilesBucketsRegistry implements FilesBucketsRegistryPort {
  constructor(
    @Inject(FILES_BUCKETS_MODULE_OPTIONS)
    private readonly options: FilesBucketsConfigAdapterModuleOptions
  ) {}

  get(name: string): FilesBucket | undefined {
    return this.options.buckets.find((bucket) => bucket.name === name)
  }

  has(name: string): boolean {
    return Boolean(this.options.buckets.find((bucket) => bucket.name === name))
  }
}
