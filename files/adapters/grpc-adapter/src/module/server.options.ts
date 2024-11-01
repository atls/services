import type { GrpcOptions }                 from '@nestjs/microservices'

import { Transport }                        from '@nestjs/microservices'
import { serverReflectionPath }             from '@atls/nestjs-grpc-reflection/proto'

import { filesServicePath }                 from '@atls/services-proto-files'
import { protobufPackage }                  from '@atls/services-proto-files'
import { includeDirs as filesIncludeDirs }  from '@atls/services-proto-files'
import { uploadServicePath }                from '@atls/services-proto-upload'
import { includeDirs as uploadIncludeDirs } from '@atls/services-proto-upload'

export const serverOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: ['grpc.reflection.v1alpha', protobufPackage],
    protoPath: [serverReflectionPath, uploadServicePath, filesServicePath],
    url: '0.0.0.0:50051',
    loader: {
      arrays: true,
      enums: String,
      keepCase: false,
      defaults: true,
      oneofs: true,
      includeDirs: uploadIncludeDirs.concat(filesIncludeDirs),
    },
  },
}
