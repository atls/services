import { AggregateRoot }    from '@nestjs/cqrs'

import { FileCreatedEvent } from '../events'
import { FilesBucketType }  from '../interfaces'

export class File extends AggregateRoot {
  private id!: string

  private ownerId!: string

  private type!: FilesBucketType

  private url!: string

  private bucket!: string

  private name!: string

  private size!: number

  private contentType?: string

  private cacheControl?: string

  private contentDisposition?: string

  private contentEncoding?: string

  private contentLanguage?: string

  private metadata?: { [key: string]: string }

  static async create(
    id: string,
    ownerId: string,
    type: FilesBucketType,
    url: string,
    bucket: string,
    name: string,
    size: number,
    contentType?: string,
    cacheControl?: string,
    contentDisposition?: string,
    contentEncoding?: string,
    contentLanguage?: string,
    metadata?: { [key: string]: string }
  ) {
    const file = new File()

    file.apply(
      new FileCreatedEvent(
        id,
        ownerId,
        type,
        url,
        bucket,
        name,
        size,
        contentType,
        cacheControl,
        contentDisposition,
        contentEncoding,
        contentLanguage,
        metadata
      )
    )

    return file
  }

  onFileCreatedEvent(event: FileCreatedEvent) {
    this.id = event.fileId
    this.ownerId = event.ownerId
    this.type = event.type
    this.url = event.url
    this.bucket = event.bucket
    this.name = event.name
    this.size = event.size
    this.contentType = event.contentType
    this.cacheControl = event.cacheControl
    this.contentDisposition = event.contentDisposition
    this.contentEncoding = event.contentEncoding
    this.contentLanguage = event.contentLanguage
    this.metadata = event.metadata
  }
}
