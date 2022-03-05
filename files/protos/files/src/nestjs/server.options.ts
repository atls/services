import { Transport }            from '@nestjs/microservices'
import { GrpcOptions }          from '@nestjs/microservices'
import { serverReflectionPath } from '@atls/nestjs-grpc-reflection/proto'

import { protobufPackage }      from '../gen/nestjs/tech/atls/files/v1alpha1/files_service'
import { filesServicePath }     from '../paths'
import { includeDirs }          from '../paths'

export const serverOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: ['grpc.reflection.v1alpha', protobufPackage],
    protoPath: [serverReflectionPath, filesServicePath],
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
