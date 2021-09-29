import { Module }                          from '@nestjs/common'
import { TypaModule }                      from '@typa/common'
import { TypaEnvConfig }                   from '@typa/common'

import { GrpcPlaygroundModule }            from '@atls/nestjs-grpc-playground'
import { PrivateKeyAuthenticator }         from '@atls/nestjs-grpc-playground'

import { FilesBucketsConfigAdapterModule } from '@files/buckets-config-adapter-module'
import { FilesBucketsEnvConfig }           from '@files/buckets-config-adapter-module'
import { FilesBucketsRegistry }            from '@files/buckets-config-adapter-module'
import { FilesApplicationEnvConfig }       from '@files/storage-adapter-module'
import { FilesStorageAdapterModule }       from '@files/storage-adapter-module'
import { Storage }                         from '@files/storage-adapter-module'
import { serverOptions }                   from '@atls/services-proto-files'
import { UploadGrpcAdapterModule }         from '@files/upload-grpc-adapter-module'
import { FilesGrpcAdapterModule }          from '@files/files-grpc-adapter-module'
import { FilesProjectionModule }           from '@files/projection-module'
import { FilesDomainModule }               from '@files/domain-module'

@Module({
  imports: [
    TypaModule.registerAsync({
      useClass: TypaEnvConfig,
    }),
    GrpcPlaygroundModule.register({
      options: serverOptions.options,
      authenticator: process.env.IDENTITY_PRIVATE_KEY
        ? new PrivateKeyAuthenticator(process.env.IDENTITY_PRIVATE_KEY!)
        : undefined,
    }),
    FilesGrpcAdapterModule.register(),
    UploadGrpcAdapterModule.register(),
    FilesStorageAdapterModule.registerAsync({
      useClass: FilesApplicationEnvConfig,
    }),
    FilesBucketsConfigAdapterModule.registerAsync({
      useClass: FilesBucketsEnvConfig,
    }),
    FilesDomainModule.registerAsync({
      useFactory: (bucketsRegistry: FilesBucketsRegistry, storage: Storage) => ({
        bucketsRegistry,
        storage,
      }),
      inject: [FilesBucketsRegistry, Storage],
    }),
    FilesProjectionModule.registerAsync({
      useFactory: (storage: Storage) => ({
        storage,
      }),
      inject: [Storage],
    }),
  ],
})
export class FilesServiceModule {}
