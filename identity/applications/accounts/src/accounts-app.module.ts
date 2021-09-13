import { Module }                    from '@nestjs/common'
import { EventEmitterModule }        from '@nestjs/event-emitter'

import { KratosModule }              from '@atls/nestjs-kratos'
import { KratosEnvConfig }           from '@atls/nestjs-kratos'
import { HydraModule }               from '@atls/nestjs-hydra'
import { HydraEnvConfig }            from '@atls/nestjs-hydra'
import { ExternalRendererModule }    from '@atls/nestjs-external-renderer'
import { ExternalRendererEnvConfig } from '@atls/nestjs-external-renderer'

import { AccountsIdpModule }         from '@identity/accounts-idp-module'
import { AccountsSsoModule }         from '@identity/accounts-sso-module'

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    KratosModule.registerAsync({
      useClass: KratosEnvConfig,
    }),
    HydraModule.registerAsync({
      useClass: HydraEnvConfig,
    }),
    ExternalRendererModule.registerAsync({
      useClass: ExternalRendererEnvConfig,
    }),
    AccountsIdpModule.register(),
    AccountsSsoModule.register(),
  ],
})
export class AccountsAppModule {}
