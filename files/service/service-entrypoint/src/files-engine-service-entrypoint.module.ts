import { MicroservisesRegistryModule }     from '@atls/nestjs-microservices-registry'
import { Module }                          from '@nestjs/common'

import { FilesEngineApplicationModule }    from '@files-engine/application-module'
import { FilesEngineInfrastructureModule } from '@files-engine/infrastructure-module'

@Module({
  imports: [
    MicroservisesRegistryModule.register(),
    FilesEngineApplicationModule.register(),
    FilesEngineInfrastructureModule.register(),
  ],
})
export class FilesEngineServiceEntrypointModule {}
