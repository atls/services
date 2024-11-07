import { Metadata }         from '@grpc/grpc-js'
/* eslint-disable */
import { GrpcMethod }       from '@nestjs/microservices'
import { GrpcStreamMethod } from '@nestjs/microservices'
import { Observable }       from 'rxjs'
import Long                 from 'long'
// @ts-expect-error
import _m0                  from 'protobufjs/minimal'

import { File }             from '../../../../tech/atls/files/v1alpha1/file.js'

export const protobufPackage = 'tech.atls.files.v1alpha1'

export interface ListFilesRequest {
  pager?: ListFilesRequest_Pager
  query?: ListFilesRequest_Query
  order?: ListFilesRequest_Order
}

export enum ListFilesRequest_OrderDirection {
  ORDER_DIRECTION_ASC_UNSPECIFIED = 'ORDER_DIRECTION_ASC_UNSPECIFIED',
  ORDER_DIRECTION_DESC = 'ORDER_DIRECTION_DESC',
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
  id?: ListFilesRequest_IdQuery
}

export interface ListFilesRequest_Order {
  field: string
  direction: ListFilesRequest_OrderDirection
}

export interface ListFilesResponse {
  files: File[]
  hasNextPage: string
}

export const TECH_atls_FILES_V1ALPHA1_PACKAGE_NAME = 'tech.atls.files.v1alpha1'

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

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any
  _m0.configure()
}
