import type { DynamicModule }               from '@nestjs/common'

import type { InfrastructureModuleOptions } from './infrastructure.module.interfaces.js'

import { ConnectRpcServer }                 from '@atls/nestjs-connectrpc'
import { ServerProtocol }                   from '@atls/nestjs-connectrpc'
import { MicroservisesRegistryModule }      from '@atls/nestjs-microservices-registry'
import { ValidationModule }                 from '@atls/nestjs-validation'
import { Module }                           from '@nestjs/common'
import { ConfigModule }                     from '@nestjs/config'
import { CqrsModule }                       from '@nestjs/cqrs'

import * as controllers                     from '../controllers/index.js'
import * as handlers                        from '../handlers/index.js'
import { infrastructureProviders }          from './infrastructure.module.providers.js'

@Module({})
export class InfrastructureModule {
  static register(options: InfrastructureModuleOptions = {}): DynamicModule {
    return {
      global: true,
      module: InfrastructureModule,
      controllers: Object.values(controllers),
      providers: [...Object.values(handlers), ...infrastructureProviders],
      imports: [
        MicroservisesRegistryModule.connect({
          strategy: new ConnectRpcServer({
            protocol: ServerProtocol.HTTP2_INSECURE,
            port: 50051,
          }),
        }),
        ValidationModule.register(),
        CqrsModule,
        ConfigModule.forRoot({ isGlobal: true, ...options }),
      ],
      exports: [CqrsModule, ...infrastructureProviders],
    }
  }
}
