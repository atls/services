import type { DynamicModule }      from '@nestjs/common'

import type { FilesServiceClient } from '../gen/nestjs/tech/atls/files/v1alpha1/files_service.js'

import { Module }                  from '@nestjs/common'
import { ClientProxyFactory }      from '@nestjs/microservices'
import { Transport }               from '@nestjs/microservices'

import { FILES_SERVICE_NAME }      from '../gen/nestjs/tech/atls/files/v1alpha1/files_service.js'
import { protobufPackage }         from '../gen/nestjs/tech/atls/files/v1alpha1/files_service.js'
import { filesServicePath }        from '../paths.js'
import { includeDirs }             from '../paths.js'

export interface FilesServiceClientModuleOptions {
  url?: string
}

export const FILES_SERVICE_CLIENT_TOKEN = `${FILES_SERVICE_NAME}Client`

@Module({})
export class FilesServiceClientModule {
  static register(options: FilesServiceClientModuleOptions = {}): DynamicModule {
    const filesServiceClientProvider = {
      provide: FILES_SERVICE_CLIENT_TOKEN,
      useFactory: (): FilesServiceClient => {
        const client = ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: protobufPackage,
            url: options.url || process.env.FILES_SERVICE_URL || '0.0.0.0:50051',
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
