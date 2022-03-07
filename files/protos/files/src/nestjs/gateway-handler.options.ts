import { protobufPackage }  from '../gen/nestjs/tech/atls/files/v1alpha1/files_service'
import { filesServicePath } from '../paths'
import { includeDirs }      from '../paths'

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
