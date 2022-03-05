import { DynamicModule }      from '@nestjs/common'
import { Module }             from '@nestjs/common'
import { Transport }          from '@nestjs/microservices'
import { ClientProxyFactory } from '@nestjs/microservices'

import { protobufPackage }    from './tech/atls/files/v1alpha1/files_service'
import { FilesServiceClient } from './tech/atls/files/v1alpha1/files_service'
import { FILES_SERVICE_NAME } from './tech/atls/files/v1alpha1/files_service'
import { filesServicePath }   from './paths'
import { includeDirs }        from './paths'

export interface FilesServiceClientModuleOptions {
  url?: string
}

export const FILES_SERVICE_CLIENT_TOKEN = `${FILES_SERVICE_NAME}Client`

@Module({})
export class FilesServiceClientModule {
  static register(options: FilesServiceClientModuleOptions = {}): DynamicModule {
    const filesServiceClientProvider = {
      provide: FILES_SERVICE_CLIENT_TOKEN,
      useFactory: () => {
        const client = ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: protobufPackage,
            url: options.url || '0.0.0.0:50051',
            protoPath: filesServicePath,
            loader: {
              arrays: true,
              keepCase: false,
              defaults: true,
              oneofs: true,
              includeDirs,
            },
          },
        })

        return client.getService<FilesServiceClient>(FILES_SERVICE_NAME)
      },
    }

    return {
      global: true,
      module: FilesServiceClientModule,
      providers: [filesServiceClientProvider],
      exports: [filesServiceClientProvider],
    }
  }
}
