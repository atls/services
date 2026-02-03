import { MicroservisesRegistryModule } from '@atls/nestjs-microservices-registry'
import { Module }                      from '@nestjs/common'

import { ApplicationModule }           from '@auth/application-module'
import { InfrastructureModule }        from '@auth/infrastructure-module'

import * as configs                    from './configs/index.js'

@Module({
  imports: [
    MicroservisesRegistryModule.register(),
    InfrastructureModule.register({ load: Object.values(configs) }),
    ApplicationModule.register(),
  ],
})
export class UsersServiceEntrypointModule {}
