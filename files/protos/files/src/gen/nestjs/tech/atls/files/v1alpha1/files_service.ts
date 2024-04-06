import type { UntypedServiceImplementation } from '@grpc/grpc-js'
import type { handleUnaryCall }              from '@grpc/grpc-js'

/* eslint-disable */
import { Metadata }                          from '@grpc/grpc-js'
import { GrpcMethod }                        from '@nestjs/microservices'
import { GrpcStreamMethod }                  from '@nestjs/microservices'

import _m0                                   from 'protobufjs/minimal'
import { Observable }                        from 'rxjs'

import { File }                              from './file'

export const protobufPackage = 'tech.atls.files.v1alpha1'

export interface ListFilesRequest {
  pager?: ListFilesRequest_Pager | undefined
  query?: ListFilesRequest_Query | undefined
  order?: ListFilesRequest_Order | undefined
}

export enum ListFilesRequest_OrderDirection {
  ORDER_DIRECTION_ASC_UNSPECIFIED = 'ORDER_DIRECTION_ASC_UNSPECIFIED',
  ORDER_DIRECTION_DESC = 'ORDER_DIRECTION_DESC',
}

export function listFilesRequest_OrderDirectionFromJSON(
  object: any
): ListFilesRequest_OrderDirection {
  switch (object) {
    case 0:
    case 'ORDER_DIRECTION_ASC_UNSPECIFIED':
      return ListFilesRequest_OrderDirection.ORDER_DIRECTION_ASC_UNSPECIFIED
    case 1:
    case 'ORDER_DIRECTION_DESC':
      return ListFilesRequest_OrderDirection.ORDER_DIRECTION_DESC
    default:
      throw new globalThis.Error(
        'Unrecognized enum value ' + object + ' for enum ListFilesRequest_OrderDirection'
      )
  }
}

export function listFilesRequest_OrderDirectionToNumber(
  object: ListFilesRequest_OrderDirection
): number {
  switch (object) {
    case ListFilesRequest_OrderDirection.ORDER_DIRECTION_ASC_UNSPECIFIED:
      return 0
    case ListFilesRequest_OrderDirection.ORDER_DIRECTION_DESC:
      return 1
    default:
      throw new globalThis.Error(
        'Unrecognized enum value ' + object + ' for enum ListFilesRequest_OrderDirection'
      )
  }
}

export interface ListFilesRequest_Pager {
  offset: number
  take: number
}

export interface ListFilesRequest_IncludeCondition {
  values: string[]
}

export interface ListFilesRequest_EqualCondition {
  value: string
}

export interface ListFilesRequest_IdQuery {
  eq?: ListFilesRequest_EqualCondition | undefined
  in?: ListFilesRequest_IncludeCondition | undefined
}

export interface ListFilesRequest_Query {
  id?: ListFilesRequest_IdQuery | undefined
}

export interface ListFilesRequest_Order {
  field: string
  direction: ListFilesRequest_OrderDirection
}

export interface ListFilesResponse {
  files: File[]
  hasNextPage: string
}

export const TECH_ATLS_FILES_V1ALPHA1_PACKAGE_NAME = 'tech.atls.files.v1alpha1'

function createBaseListFilesRequest(): ListFilesRequest {
  return {}
}

export const ListFilesRequest = {
  encode(message: ListFilesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pager !== undefined) {
      ListFilesRequest_Pager.encode(message.pager, writer.uint32(10).fork()).ldelim()
    }
    if (message.query !== undefined) {
      ListFilesRequest_Query.encode(message.query, writer.uint32(18).fork()).ldelim()
    }
    if (message.order !== undefined) {
      ListFilesRequest_Order.encode(message.order, writer.uint32(26).fork()).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListFilesRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseListFilesRequest()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }

          message.pager = ListFilesRequest_Pager.decode(reader, reader.uint32())
          continue
        case 2:
          if (tag !== 18) {
            break
          }

          message.query = ListFilesRequest_Query.decode(reader, reader.uint32())
          continue
        case 3:
          if (tag !== 26) {
            break
          }

          message.order = ListFilesRequest_Order.decode(reader, reader.uint32())
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
}

function createBaseListFilesRequest_Pager(): ListFilesRequest_Pager {
  return { offset: 0, take: 0 }
}

export const ListFilesRequest_Pager = {
  encode(message: ListFilesRequest_Pager, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.offset !== 0) {
      writer.uint32(8).int32(message.offset)
    }
    if (message.take !== 0) {
      writer.uint32(16).int32(message.take)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListFilesRequest_Pager {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseListFilesRequest_Pager()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break
          }

          message.offset = reader.int32()
          continue
        case 2:
          if (tag !== 16) {
            break
          }

          message.take = reader.int32()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
}

function createBaseListFilesRequest_IncludeCondition(): ListFilesRequest_IncludeCondition {
  return { values: [] }
}

export const ListFilesRequest_IncludeCondition = {
  encode(
    message: ListFilesRequest_IncludeCondition,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.values) {
      writer.uint32(10).string(v!)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListFilesRequest_IncludeCondition {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseListFilesRequest_IncludeCondition()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }

          message.values.push(reader.string())
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
}

function createBaseListFilesRequest_EqualCondition(): ListFilesRequest_EqualCondition {
  return { value: '' }
}

export const ListFilesRequest_EqualCondition = {
  encode(
    message: ListFilesRequest_EqualCondition,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.value !== '') {
      writer.uint32(10).string(message.value)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListFilesRequest_EqualCondition {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseListFilesRequest_EqualCondition()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }

          message.value = reader.string()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
}

function createBaseListFilesRequest_IdQuery(): ListFilesRequest_IdQuery {
  return {}
}

export const ListFilesRequest_IdQuery = {
  encode(message: ListFilesRequest_IdQuery, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.eq !== undefined) {
      ListFilesRequest_EqualCondition.encode(message.eq, writer.uint32(10).fork()).ldelim()
    }
    if (message.in !== undefined) {
      ListFilesRequest_IncludeCondition.encode(message.in, writer.uint32(18).fork()).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListFilesRequest_IdQuery {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseListFilesRequest_IdQuery()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }

          message.eq = ListFilesRequest_EqualCondition.decode(reader, reader.uint32())
          continue
        case 2:
          if (tag !== 18) {
            break
          }

          message.in = ListFilesRequest_IncludeCondition.decode(reader, reader.uint32())
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
}

function createBaseListFilesRequest_Query(): ListFilesRequest_Query {
  return {}
}

export const ListFilesRequest_Query = {
  encode(message: ListFilesRequest_Query, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== undefined) {
      ListFilesRequest_IdQuery.encode(message.id, writer.uint32(10).fork()).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListFilesRequest_Query {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseListFilesRequest_Query()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }

          message.id = ListFilesRequest_IdQuery.decode(reader, reader.uint32())
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
}

function createBaseListFilesRequest_Order(): ListFilesRequest_Order {
  return { field: '', direction: ListFilesRequest_OrderDirection.ORDER_DIRECTION_ASC_UNSPECIFIED }
}

export const ListFilesRequest_Order = {
  encode(message: ListFilesRequest_Order, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.field !== '') {
      writer.uint32(10).string(message.field)
    }
    if (message.direction !== ListFilesRequest_OrderDirection.ORDER_DIRECTION_ASC_UNSPECIFIED) {
      writer.uint32(16).int32(listFilesRequest_OrderDirectionToNumber(message.direction))
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListFilesRequest_Order {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseListFilesRequest_Order()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }

          message.field = reader.string()
          continue
        case 2:
          if (tag !== 16) {
            break
          }

          message.direction = listFilesRequest_OrderDirectionFromJSON(reader.int32())
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
}

function createBaseListFilesResponse(): ListFilesResponse {
  return { files: [], hasNextPage: '' }
}

export const ListFilesResponse = {
  encode(message: ListFilesResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.files) {
      File.encode(v!, writer.uint32(10).fork()).ldelim()
    }
    if (message.hasNextPage !== '') {
      writer.uint32(18).string(message.hasNextPage)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListFilesResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseListFilesResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }

          message.files.push(File.decode(reader, reader.uint32()))
          continue
        case 2:
          if (tag !== 18) {
            break
          }

          message.hasNextPage = reader.string()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
}

export interface FilesServiceClient {
  listFiles(request: ListFilesRequest, metadata?: Metadata): Observable<ListFilesResponse>
}

export interface FilesServiceController {
  listFiles(
    request: ListFilesRequest,
    metadata?: Metadata
  ): Promise<ListFilesResponse> | Observable<ListFilesResponse> | ListFilesResponse
}

export function FilesServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['listFiles']
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method)
      GrpcMethod('FilesService', method)(constructor.prototype[method], method, descriptor)
    }
    const grpcStreamMethods: string[] = []
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method)
      GrpcStreamMethod('FilesService', method)(constructor.prototype[method], method, descriptor)
    }
  }
}

export const FILES_SERVICE_NAME = 'FilesService'

export type FilesServiceService = typeof FilesServiceService
export const FilesServiceService = {
  listFiles: {
    path: '/tech.atls.files.v1alpha1.FilesService/ListFiles',
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ListFilesRequest) =>
      Buffer.from(ListFilesRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => ListFilesRequest.decode(value),
    responseSerialize: (value: ListFilesResponse) =>
      Buffer.from(ListFilesResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => ListFilesResponse.decode(value),
  },
} as const

export interface FilesServiceServer extends UntypedServiceImplementation {
  listFiles: handleUnaryCall<ListFilesRequest, ListFilesResponse>
}
