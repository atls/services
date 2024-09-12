import { Metadata }         from '@grpc/grpc-js'
/* eslint-disable */
import { GrpcMethod }       from '@nestjs/microservices'
import { GrpcStreamMethod } from '@nestjs/microservices'
import { Observable }       from 'rxjs'
import Long                 from 'long'
import _m0                  from 'protobufjs/minimal'

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

export const TECH_atls_FILES_V1ALPHA1_PACKAGE_NAME = 'tech.atls.files.v1alpha1'

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

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any
  _m0.configure()
}
