import type { GrpcOptions }                from '@nestjs/microservices'

import { Transport }                       from '@nestjs/microservices'
import { serverReflectionPath }            from '@atls/nestjs-grpc-reflection/proto'

import { filesServicePath }                from '@atls/services-proto-files'
import { protobufPackage }                 from '@atls/services-proto-files'
import { includeDirs as filesIncludeDirs } from '@atls/services-proto-files'

export const serverOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: ['grpc.reflection.v1', protobufPackage],
    protoPath: [serverReflectionPath, filesServicePath],
    url: process.env.FILES_SERVICE_URL || '0.0.0.0:50051',
    loader: {
      arrays: true,
      enums: String,
      keepCase: false,
      defaults: true,
      oneofs: true,
      includeDirs: filesIncludeDirs,
    },
  },
}
