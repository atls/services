import { Module }                          from '@nestjs/common'

import { FilesApplicationeModule }         from '@files/application-module'
import { FilesBucketsConfigAdapterModule } from '@files/buckets-config-adapter-module'
import { FilesBucketsEnvConfig }           from '@files/buckets-config-adapter-module'
import { CqrsAdapterModule }               from '@files/cqrs-adapter-module'
import { FilesGrpcAdapterModule }          from '@files/grpc-adapter-module'
import { FilesInfrastructureModule }       from '@files/infrastructure-module'
import { FilesApplicationEnvConfig }       from '@files/storage-adapter-module'
import { FilesStorageAdapterModule }       from '@files/storage-adapter-module'

@Module({
  imports: [
    CqrsAdapterModule.register(),
    FilesGrpcAdapterModule.register(),
    FilesStorageAdapterModule.registerAsync({
      useClass: FilesApplicationEnvConfig,
    }),
    FilesBucketsConfigAdapterModule.registerAsync({
      useClass: FilesBucketsEnvConfig,
    }),
    FilesInfrastructureModule.register(),
    FilesApplicationeModule.register(),
  ],
})
export class FilesServiceEntrypointModule {}
