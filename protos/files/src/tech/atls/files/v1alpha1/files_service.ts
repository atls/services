/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices'
import Long                             from 'long'
import _m0                              from 'protobufjs/minimal'
import { Observable }                   from 'rxjs'
import { File }                         from '../../../../tech/atls/files/v1alpha1/file'
import { Metadata }                     from 'grpc'

export const protobufPackage = 'tech.atls.files.v1alpha1'

export interface ListOwnedFilesRequest {
  pager?: ListOwnedFilesRequest_Pager
  query?: ListOwnedFilesRequest_Query
  order?: ListOwnedFilesRequest_Order
}

export enum ListOwnedFilesRequest_OrderDirection {
  ORDER_DIRECTION_ASC_UNSPECIFIED = 0,
  ORDER_DIRECTION_DESC = 1,
  UNRECOGNIZED = -1,
}

export interface ListOwnedFilesRequest_Pager {
  offset: number
  take: number
}

export interface ListOwnedFilesRequest_IdQuery {
  eq?: string | undefined
  in?: string[]
}

export interface ListOwnedFilesRequest_Query {
  id?: ListOwnedFilesRequest_IdQuery
}

export interface ListOwnedFilesRequest_Order {
  field: string
  direction: ListOwnedFilesRequest_OrderDirection
}

export interface ListOwnedFilesResponse {
  files: File[]
  hasNextPage: string
}

export interface ListPublicFilesRequest {
  pager?: ListPublicFilesRequest_Pager
  query?: ListPublicFilesRequest_Query
  order?: ListPublicFilesRequest_Order
}

export enum ListPublicFilesRequest_OrderDirection {
  ORDER_DIRECTION_ASC_UNSPECIFIED = 0,
  ORDER_DIRECTION_DESC = 1,
  UNRECOGNIZED = -1,
}

export interface ListPublicFilesRequest_Pager {
  offset: number
  take: number
}

export interface ListPublicFilesRequest_IdQuery {
  eq?: string | undefined
  in?: string[]
}

export interface ListPublicFilesRequest_Query {
  id?: ListPublicFilesRequest_IdQuery
}

export interface ListPublicFilesRequest_Order {
  field: string
  direction: ListPublicFilesRequest_OrderDirection
}

export interface ListPublicFilesResponse {
  files: File[]
  hasNextPage: string
}

export const TECH_ATLS_FILES_V1ALPHA1_PACKAGE_NAME = 'tech.atls.files.v1alpha1'

export interface FilesServiceClient {
  listOwnedFiles(
    request: ListOwnedFilesRequest,
    metadata?: Metadata
  ): Observable<ListOwnedFilesResponse>

  listPublicFiles(
    request: ListPublicFilesRequest,
    metadata?: Metadata
  ): Observable<ListPublicFilesResponse>
}

export interface FilesServiceController {
  listOwnedFiles(
    request: ListOwnedFilesRequest,
    metadata?: Metadata
  ): Promise<ListOwnedFilesResponse> | Observable<ListOwnedFilesResponse> | ListOwnedFilesResponse

  listPublicFiles(
    request: ListPublicFilesRequest,
    metadata?: Metadata
  ):
    | Promise<ListPublicFilesResponse>
    | Observable<ListPublicFilesResponse>
    | ListPublicFilesResponse
}

export function FilesServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['listOwnedFiles', 'listPublicFiles']
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
