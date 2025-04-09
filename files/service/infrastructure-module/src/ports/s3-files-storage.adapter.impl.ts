import type { File }                             from '@files-engine/domain-module'
import type { Upload }                           from '@files-engine/domain-module'

import { join }                                  from 'node:path'
import { relative }                              from 'node:path'

import { Logger }                                from '@atls/logger'
import { S3ClientFactory }                       from '@atls/nestjs-s3-client'
import { S3Client }                              from '@atls/nestjs-s3-client'
import { PutObjectCommand }                      from '@atls/nestjs-s3-client'
import { HeadObjectCommand }                     from '@atls/nestjs-s3-client'
import { GetObjectCommand }                      from '@atls/nestjs-s3-client'
import { Injectable }                            from '@nestjs/common'
import { getSignedUrl }                          from '@atls/nestjs-s3-client'

import { FilesStorageAdapter }                   from '@files-engine/domain-module'
import { StorageFileMetadata }                   from '@files-engine/domain-module'

import { FilesEngineInfrastructureModuleConfig } from '../module/index.js'

@Injectable()
export class S3FilesStorageAdapterImpl extends FilesStorageAdapter {
  localhostClient?: S3Client

  #logger = new Logger(S3FilesStorageAdapterImpl.name)

  constructor(
    private readonly client: S3Client,
    private readonly config: FilesEngineInfrastructureModuleConfig,
    private readonly clientFactory: S3ClientFactory
  ) {
    super()

    if (config.s3.localhostEndpoint) {
      this.localhostClient = this.clientFactory.create({
        ...this.config.s3,
        endpoint: config.s3.localhostEndpoint,
      })
    }
  }

  override async generateReadUrl(file: File): Promise<string | undefined> {
    const [, filename] = new URL(file.url).pathname.split(`${file.bucket}/`)

    const signedUrl = await getSignedUrl(
      this.localhostClient || this.client,
      new GetObjectCommand({
        Bucket: file.bucket,
        Key: filename,
      })
    )

    return signedUrl
  }

  override async prepareUpload(upload: Upload): Promise<string> {
    const filename = upload.bucket.path.startsWith('/')
      ? relative('/', join(upload.bucket.path, upload.filename))
      : join(upload.bucket.path, upload.filename)

    const url = await getSignedUrl(
      this.localhostClient || this.client,
      new PutObjectCommand({
        ContentType: upload.contentType,
        Bucket: upload.bucket.bucket,
        Key: filename,
      }),
      { expiresIn: 3600 }
    )

    return url
  }

  override async toFileMetadata(upload: Upload): Promise<StorageFileMetadata | undefined> {
    const filename = upload.bucket.path.startsWith('/')
      ? relative('/', join(upload.bucket.path, upload.filename))
      : join(upload.bucket.path, upload.filename)

    try {
      const response = await this.client.send(
        new HeadObjectCommand({
          Bucket: upload.bucket.bucket,
          Key: filename,
        })
      )

      const signedUrl = await getSignedUrl(
        this.localhostClient || this.client,
        new GetObjectCommand({
          Bucket: upload.bucket.bucket,
          Key: filename,
        })
      )

      return StorageFileMetadata.create(
        Object.assign(new URL(signedUrl), { search: '' }).toString(),
        response.ContentLength || upload.size,
        response.ContentType || upload.contentType
      )
    } catch (error) {
      if (error instanceof Error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((error as any)?.$metadata?.httpStatusCode !== 404) {
          this.#logger.error(error)
        }
      }

      return undefined
    }
  }
}
