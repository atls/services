import type { DynamicModule }       from '@nestjs/common'

import type { UploadServiceClient } from '../gen/nestjs/tech/atls/files/v1alpha1/upload_service.js'

import { Module }                   from '@nestjs/common'
import { ClientProxyFactory }       from '@nestjs/microservices'
import { Transport }                from '@nestjs/microservices'

import { UPLOAD_SERVICE_NAME }      from '../gen/nestjs/tech/atls/files/v1alpha1/upload_service.js'
import { protobufPackage }          from '../gen/nestjs/tech/atls/files/v1alpha1/upload_service.js'
import { uploadServicePath }        from '../paths.js'
import { includeDirs }              from '../paths.js'

export interface UploadServiceClientModuleOptions {
  url?: string
}

export const UPLOAD_SERVICE_CLIENT_TOKEN = `${UPLOAD_SERVICE_NAME}Client`

@Module({})
export class UploadServiceClientModule {
  static register(options: UploadServiceClientModuleOptions = {}): DynamicModule {
    const filesServiceClientProvider = {
      provide: UPLOAD_SERVICE_CLIENT_TOKEN,
      useFactory: (): UploadServiceClient => {
        const client = ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: protobufPackage,
            url: options.url || process.env.FILES_SERVICE_URL || '0.0.0.0:50051',
            protoPath: uploadServicePath,
            loader: {
              arrays: true,
              keepCase: false,
              defaults: true,
              oneofs: true,
              includeDirs,
            },
          },
        })

        return client.getService<UploadServiceClient>(UPLOAD_SERVICE_NAME)
      },
    }

    return {
      global: true,
      module: UploadServiceClientModule,
      providers: [filesServiceClientProvider],
      exports: [filesServiceClientProvider],
    }
  }
}
