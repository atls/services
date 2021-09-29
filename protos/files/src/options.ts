import { Transport }            from '@nestjs/microservices'
import { GrpcOptions }          from '@nestjs/microservices'

import { serverReflectionPath } from '@atls/nestjs-grpc-reflection/proto'
import { protobufPackage }      from './tech/atls/files/v1alpha1/upload_service'
import { uploadServicePath }    from './paths'
import { filesServicePath }     from './paths'
import { includeDirs }          from './paths'

export const serverOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: ['grpc.reflection.v1alpha', protobufPackage],
    protoPath: [serverReflectionPath, uploadServicePath, filesServicePath],
    url: '0.0.0.0:50051',
    loader: {
      arrays: true,
      keepCase: false,
      defaults: true,
      oneofs: true,
      includeDirs,
    },
  },
}

export const uploadGatewayHandler = {
  endpoint: process.env.FILES_SERVICE_URL || '0.0.0.0:50051',
  protoFilePath: {
    file: uploadServicePath,
    load: { arrays: true, keepCase: false, defaults: true, oneofs: true, includeDirs },
  },
  serviceName: 'UploadService',
  packageName: protobufPackage,
  metaData: {
    authorization: ['req', 'headers', 'authorization'],
  },
}

export const filesGatewayHandler = {
  endpoint: process.env.FILES_SERVICE_URL || '0.0.0.0:50051',
  protoFilePath: {
    file: filesServicePath,
    load: { arrays: true, keepCase: false, defaults: true, oneofs: true, includeDirs },
  },
  serviceName: 'FilesService',
  packageName: protobufPackage,
  metaData: {
    authorization: ['req', 'headers', 'authorization'],
  },
}
