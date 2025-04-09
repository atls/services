import { filesServicePath } from '@atls/files-rpc'
import { includeDirs }      from '@atls/files-rpc'

export const filesHandler = {
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
  serviceName: 'FilesEngine',
  packageName: 'tech.atls.files_engine.v1alpha1',
  metaData: {
    authorization: ['req', 'headers', 'authorization'],
    x_user: ['req', 'headers', 'x_user'],
  },
}
