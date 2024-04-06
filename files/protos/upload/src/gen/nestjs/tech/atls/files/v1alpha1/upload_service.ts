import type { UntypedServiceImplementation }                  from '@grpc/grpc-js'

import type { handleUnaryCall } from '@grpc/grpc-js'

/* eslint-disable */
import { Metadata }                                           from '@grpc/grpc-js'
import { GrpcMethod }                                         from '@nestjs/microservices'

import { GrpcStreamMethod }                       from '@nestjs/microservices'

import _m0                                                    from 'protobufjs/minimal'
import { Observable }                                         from 'rxjs'

export const protobufPackage = 'tech.atls.files.v1alpha1'

export interface CreateUploadRequest {
  bucket: string
  name: string
  size: number
}

export interface CreateUploadResponse {
  id: string
  url: string
}

export interface ConfirmUploadRequest {
  id: string
}

export interface ConfirmUploadResponse {
  id: string
  url: string
}

export const TECH_ATLS_FILES_V1ALPHA1_PACKAGE_NAME = 'tech.atls.files.v1alpha1'

function createBaseCreateUploadRequest(): CreateUploadRequest {
  return { bucket: '', name: '', size: 0 }
}

export const CreateUploadRequest = {
  encode(message: CreateUploadRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.bucket !== '') {
      writer.uint32(10).string(message.bucket)
    }
    if (message.name !== '') {
      writer.uint32(18).string(message.name)
    }
    if (message.size !== 0) {
      writer.uint32(24).int32(message.size)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateUploadRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseCreateUploadRequest()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }

          message.bucket = reader.string()
          continue
        case 2:
          if (tag !== 18) {
            break
          }

          message.name = reader.string()
          continue
        case 3:
          if (tag !== 24) {
            break
          }

          message.size = reader.int32()
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

function createBaseCreateUploadResponse(): CreateUploadResponse {
  return { id: '', url: '' }
}

export const CreateUploadResponse = {
  encode(message: CreateUploadResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== '') {
      writer.uint32(10).string(message.id)
    }
    if (message.url !== '') {
      writer.uint32(18).string(message.url)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateUploadResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseCreateUploadResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }

          message.id = reader.string()
          continue
        case 2:
          if (tag !== 18) {
            break
          }

          message.url = reader.string()
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

function createBaseConfirmUploadRequest(): ConfirmUploadRequest {
  return { id: '' }
}

export const ConfirmUploadRequest = {
  encode(message: ConfirmUploadRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== '') {
      writer.uint32(10).string(message.id)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ConfirmUploadRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseConfirmUploadRequest()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }

          message.id = reader.string()
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

function createBaseConfirmUploadResponse(): ConfirmUploadResponse {
  return { id: '', url: '' }
}

export const ConfirmUploadResponse = {
  encode(message: ConfirmUploadResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== '') {
      writer.uint32(10).string(message.id)
    }
    if (message.url !== '') {
      writer.uint32(18).string(message.url)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ConfirmUploadResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseConfirmUploadResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }

          message.id = reader.string()
          continue
        case 2:
          if (tag !== 18) {
            break
          }

          message.url = reader.string()
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

export interface UploadServiceClient {
  createUpload(request: CreateUploadRequest, metadata?: Metadata): Observable<CreateUploadResponse>

  confirmUpload(
    request: ConfirmUploadRequest,
    metadata?: Metadata
  ): Observable<ConfirmUploadResponse>
}

export interface UploadServiceController {
  createUpload(
    request: CreateUploadRequest,
    metadata?: Metadata
  ): Promise<CreateUploadResponse> | Observable<CreateUploadResponse> | CreateUploadResponse

  confirmUpload(
    request: ConfirmUploadRequest,
    metadata?: Metadata
  ): Promise<ConfirmUploadResponse> | Observable<ConfirmUploadResponse> | ConfirmUploadResponse
}

export function UploadServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['createUpload', 'confirmUpload']
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method)
      GrpcMethod('UploadService', method)(constructor.prototype[method], method, descriptor)
    }
    const grpcStreamMethods: string[] = []
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method)
      GrpcStreamMethod('UploadService', method)(constructor.prototype[method], method, descriptor)
    }
  }
}

export const UPLOAD_SERVICE_NAME = 'UploadService'

export type UploadServiceService = typeof UploadServiceService
export const UploadServiceService = {
  createUpload: {
    path: '/tech.atls.files.v1alpha1.UploadService/CreateUpload',
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CreateUploadRequest) =>
      Buffer.from(CreateUploadRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => CreateUploadRequest.decode(value),
    responseSerialize: (value: CreateUploadResponse) =>
      Buffer.from(CreateUploadResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => CreateUploadResponse.decode(value),
  },
  confirmUpload: {
    path: '/tech.atls.files.v1alpha1.UploadService/ConfirmUpload',
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ConfirmUploadRequest) =>
      Buffer.from(ConfirmUploadRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => ConfirmUploadRequest.decode(value),
    responseSerialize: (value: ConfirmUploadResponse) =>
      Buffer.from(ConfirmUploadResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => ConfirmUploadResponse.decode(value),
  },
} as const

export interface UploadServiceServer extends UntypedServiceImplementation {
  createUpload: handleUnaryCall<CreateUploadRequest, CreateUploadResponse>
  confirmUpload: handleUnaryCall<ConfirmUploadRequest, ConfirmUploadResponse>
}
