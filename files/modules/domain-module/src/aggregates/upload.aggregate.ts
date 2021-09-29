import { Aggregate }                from '@typa/common'
import { CommandHandler }           from '@typa/common'
import { Command }                  from '@typa/common'
import { ApplyEvent }               from '@typa/common'
import { AggregateEventHandler }    from '@typa/common'
import { DomainEvent }              from '@typa/common'
import { Exclude }                  from 'class-transformer'
import { format as formatUrl }      from 'url'
import mime                         from 'mime-types'
import match                        from 'mime-match'
import { extname }                  from 'path'
import { format }                   from 'path'
import { join }                     from 'path'
import { relative }                 from 'path'
import assert                       from 'assert'

import { FilesBucket }              from '../interfaces'
import { FilesBucketsRegistryPort } from '../ports'
import { StoragePort }              from '../ports'
import { CreateUploadCommand }      from '../commands'
import { ConfirmUploadCommand }     from '../commands'
import { UploadCreatedEvent }       from '../events'
import { UploadConfirmedEvent }     from '../events'

@Aggregate()
export class Upload {
  private uploadId!: string

  private ownerId!: string

  private url!: string

  private name!: string

  private filename!: string

  private bucket!: FilesBucket

  private confirmed: boolean = false

  @Exclude()
  bucketsRegistry: FilesBucketsRegistryPort

  @Exclude()
  storage: StoragePort

  constructor(bucketsRegistry: FilesBucketsRegistryPort, storage: StoragePort) {
    this.bucketsRegistry = bucketsRegistry
    this.storage = storage
  }

  @CommandHandler(CreateUploadCommand)
  async create(@Command command: CreateUploadCommand, @ApplyEvent apply) {
    assert.ok(command.initiatorId, 'Unknown initiator')

    const filesBucket = this.bucketsRegistry.get(command.bucket)

    assert.ok(filesBucket, `Files bucket ${command.bucket} not found`)

    const contentType = mime.lookup(command.name)

    assert.ok(contentType, 'Unknown file type')

    assert.ok(
      match(contentType, filesBucket.conditions.type),
      `Files bucket ${command.bucket} not support type '${contentType}', only '${filesBucket.conditions.type}'.`
    )

    assert.ok(
      command.size > filesBucket.conditions.length.min &&
        command.size < filesBucket.conditions.length.max,
      `File size must be greater than ${filesBucket.conditions.length.min} and less than ${filesBucket.conditions.length.max}, current size is ${command.size}`
    )

    const filename = format({
      name: filesBucket.path.startsWith('/')
        ? relative('/', join(filesBucket.path, command.uploadId))
        : join(filesBucket.path, command.uploadId),
      ext: extname(command.name),
    })

    const url = await this.storage.generateUploadUrl(
      filesBucket.bucket,
      filename,
      command.size,
      contentType
    )

    apply(
      new UploadCreatedEvent(
        command.uploadId,
        command.initiatorId,
        url,
        command.name,
        filename,
        filesBucket
      )
    )
  }

  @AggregateEventHandler(UploadCreatedEvent)
  onCreated(@DomainEvent event: UploadCreatedEvent) {
    this.uploadId = event.uploadId
    this.ownerId = event.ownerId
    this.url = event.url
    this.name = event.name
    this.filename = event.filename
    this.bucket = event.bucket
  }

  @CommandHandler(ConfirmUploadCommand)
  async confirm(@Command command: ConfirmUploadCommand, @ApplyEvent apply) {
    assert.ok(this.url, 'Upload not found.')
    assert.ok(!this.confirmed, 'Upload already confirmed.')

    assert.strictEqual(
      this.ownerId,
      command.confirmatorId,
      'Upload initiator does not match the endorsement.'
    )

    const metadata = await this.storage.getMetadata(this.bucket.bucket, this.filename)

    assert.ok(metadata, 'File not uploaded.')

    const signedReadUrl = await this.storage.generateReadUrl(
      this.bucket.bucket,
      this.filename,
      this.bucket.hostname
    )

    const parsedUrl = new URL(signedReadUrl)

    parsedUrl.search = ''

    const url = formatUrl(parsedUrl)

    apply(
      new UploadConfirmedEvent(
        this.uploadId,
        this.ownerId,
        this.bucket.type,
        url,
        metadata.bucket,
        metadata.name,
        metadata.size,
        metadata.contentType,
        metadata.cacheControl,
        metadata.contentDisposition,
        metadata.contentEncoding,
        metadata.contentLanguage,
        metadata.metadata
      )
    )
  }

  @AggregateEventHandler(UploadConfirmedEvent)
  onConfirmed(@DomainEvent event: UploadConfirmedEvent) {
    this.confirmed = true
  }
}
