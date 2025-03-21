// @generated by protoc-gen-connect-es v1.6.1 with parameter "target=ts"
// @generated from file tech/atls/files_engine/v1alpha1/files.service.proto (package tech.atls.files_engine.v1alpha1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { MethodKind }              from '@bufbuild/protobuf'

import { ConfirmUploadRequest }    from './files.service_pb.js'
import { ConfirmUploadResponse }   from './files.service_pb.js'
import { CreateUploadRequest }     from './files.service_pb.js'
import { CreateUploadResponse }    from './files.service_pb.js'
import { GenerateFileUrlRequest }  from './files.service_pb.js'
import { GenerateFileUrlResponse } from './files.service_pb.js'
import { ListFilesRequest }        from './files.service_pb.js'
import { ListFilesResponse }       from './files.service_pb.js'

/**
 * @generated from service tech.atls.files_engine.v1alpha1.FilesEngine
 */
export const FilesEngine = {
  typeName: 'tech.atls.files_engine.v1alpha1.FilesEngine',
  methods: {
    /**
     * @generated from rpc tech.atls.files_engine.v1alpha1.FilesEngine.CreateUpload
     */
    createUpload: {
      name: 'CreateUpload',
      I: CreateUploadRequest,
      O: CreateUploadResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc tech.atls.files_engine.v1alpha1.FilesEngine.ConfirmUpload
     */
    confirmUpload: {
      name: 'ConfirmUpload',
      I: ConfirmUploadRequest,
      O: ConfirmUploadResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc tech.atls.files_engine.v1alpha1.FilesEngine.ListFiles
     */
    listFiles: {
      name: 'ListFiles',
      I: ListFilesRequest,
      O: ListFilesResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc tech.atls.files_engine.v1alpha1.FilesEngine.GenerateFileUrl
     */
    generateFileUrl: {
      name: 'GenerateFileUrl',
      I: GenerateFileUrlRequest,
      O: GenerateFileUrlResponse,
      kind: MethodKind.Unary,
    },
  },
} as const
