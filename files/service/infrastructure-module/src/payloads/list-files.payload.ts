/* eslint-disable max-classes-per-file */

import type { ListFilesRequest_FilesQuery } from '@atls/files-rpc/interfaces'
import type { ListFilesRequest }            from '@atls/files-rpc/interfaces'

import { IdQueryPayload }                   from '@atls/rpc-query-payloads'
import { OrderPayload }                     from '@atls/rpc-query-payloads'
import { PagerPayload }                     from '@atls/rpc-query-payloads'
import { IsOptional }                       from 'class-validator'
import { ValidateNested }                   from 'class-validator'

export class ListFilesQueryPayload {
  constructor(private readonly query: ListFilesRequest_FilesQuery) {}

  @IsOptional()
  @ValidateNested()
  get id(): IdQueryPayload {
    return new IdQueryPayload(this.query.id)
  }

  @IsOptional()
  @ValidateNested()
  get ownerId(): IdQueryPayload {
    return new IdQueryPayload(this.query.ownerId)
  }
}

export class ListFilesPayload {
  constructor(private readonly request: ListFilesRequest) {}

  @IsOptional()
  @ValidateNested()
  get pager(): PagerPayload | undefined {
    return this.request.pager ? new PagerPayload(this.request.pager) : undefined
  }

  @IsOptional()
  @ValidateNested()
  get order(): OrderPayload | undefined {
    return this.request.order ? new OrderPayload(this.request.order) : undefined
  }

  @IsOptional()
  @ValidateNested()
  get query(): ListFilesQueryPayload | undefined {
    return this.request.query ? new ListFilesQueryPayload(this.request.query) : undefined
  }
}
