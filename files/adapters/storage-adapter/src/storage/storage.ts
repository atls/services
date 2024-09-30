import type { StoragePort }                 from '@files/domain-module'

import { Logger }                           from '@atls/logger'
import { Storage as GcsStorage }            from '@google-cloud/storage'
import { Injectable }                       from '@nestjs/common'
import { Inject }                           from '@nestjs/common'

import { FILES_STORAGE_MODULE_OPTIONS }     from '../module'
import { FilesStorageAdapterModuleOptions } from '../module'

@Injectable()
export class Storage implements StoragePort {
  private readonly logger = new Logger(Storage.name)

  private readonly storage: GcsStorage

  constructor(@Inject(FILES_STORAGE_MODULE_OPTIONS) options: FilesStorageAdapterModuleOptions) {
    this.storage = new GcsStorage(options)
  }

  async generateUploadUrl(
    bucket: string,
    filename: string,
    contentLength: number,
    contentType: string
  ): Promise<string> {
    const [url] = await this.storage.bucket(bucket).file(filename).createResumableUpload({
      metadata: { contentLength, contentType },
    })

    return url
  }

  async generateReadUrl(
    bucket: string,
    filename: string,
    cname?: string,
    expiration?: number
  ): Promise<string> {
    const [url] = await this.storage
      .bucket(bucket)
      .file(filename)
      .getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + (expiration || 10 * 60 * 1000),
        cname,
      })

    return url
  }

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  async getMetadata(bucket: string, filename: string): Promise<any | null> {
    try {
      const [metadata] = await this.storage.bucket(bucket).file(filename).getMetadata()

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return metadata
    } catch (error) {
      this.logger.debug(error)

      return null
    }
  }
}
