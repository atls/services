import { protobufPackage }   from '../gen/nestjs/tech/atls/files/v1alpha1/upload_service.js'
import { uploadServicePath } from '../paths.js'
import { includeDirs }       from '../paths.js'

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
