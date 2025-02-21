import { FILES_SERVICE_NAME } from '../gen/nestjs/tech/atls/files/v1/files.service.js'
import { protobufPackage }    from '../gen/nestjs/tech/atls/files/v1/files.types.js'
import { filesServicePath }   from '../path.js'
import { includeDirs }        from '../path.js'

export const filesGatewayHandler = {
  endpoint: process.env.FILES_SERVICE_URL || '0.0.0.0:50051',
  protoFilePath: {
    file: filesServicePath,
    load: {
      arrays: true,
      keepCase: false,
      defaults: true,
      oneofs: true,
      includeDirs,
    },
  },
  serviceName: FILES_SERVICE_NAME,
  packageName: protobufPackage,
  metaData: {
    authorization: ['req', 'headers', 'authorization'],
    x_user: ['req', 'headers', 'x_user'],
  },
}

export const gatewayHandlers = [filesGatewayHandler]
