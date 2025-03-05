import type { FilesBucketType } from '../interfaces/index.js'

import { AggregateRoot }        from '@files/cqrs-adapter'

import { FileCreatedEvent }     from '../events/index.js'

export interface FileProperties {
  id: string
  ownerId: string
  type: FilesBucketType
  url: string
  bucket: string
  name: string
  size: number
  contentType?: string
  cacheControl?: string
  contentDisposition?: string
  contentEncoding?: string
  contentLanguage?: string
  metadata?: Record<string, string>
}

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

  private metadata?: Record<string, string>

  get properties(): FileProperties {
    return {
      id: this.id,
      ownerId: this.ownerId,
      type: this.type,
      url: this.url,
      bucket: this.bucket,
      name: this.name,
      size: this.size,
      contentType: this.contentType,
      cacheControl: this.cacheControl,
      contentDisposition: this.contentDisposition,
      contentEncoding: this.contentEncoding,
      contentLanguage: this.contentLanguage,
      metadata: this.metadata,
    }
  }

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
    metadata?: Record<string, string>
  ): Promise<File> {
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

  onFileCreatedEvent(event: FileCreatedEvent): void {
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
