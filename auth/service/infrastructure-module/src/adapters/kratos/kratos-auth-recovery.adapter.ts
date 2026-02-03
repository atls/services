import type { KratosConfig }   from '../../interfaces/index.js'

import { AssertionError }      from 'node:assert'
import assert                  from 'node:assert'

import { Injectable }          from '@nestjs/common'
import { ConfigService }       from '@nestjs/config'
import { Configuration }       from '@ory/kratos-client'
import { RecoveryFlowState }   from '@ory/kratos-client'
import { FrontendApi }         from '@ory/kratos-client'

import { AuthRecoveryPort }    from '@auth/application-module'
import { AuthEmail }           from '@auth/application-module'
import { AuthCode }            from '@auth/application-module'
import { AuthProcess }         from '@auth/domain-module'
import { AuthProcessType }     from '@auth/domain-module'
import { UserSession }         from '@auth/domain-module'

import { KratosAuthException } from '../../exceptions/index.js'

@Injectable()
export class KratosAuthRecoveryAdapter implements AuthRecoveryPort {
  private readonly kratosClient: FrontendApi

  constructor(private configService: ConfigService) {
    const kratosUrl = this.configService.get<KratosConfig['url']>('kratos.url')

    this.kratosClient = new FrontendApi(new Configuration({ basePath: kratosUrl }))
  }

  async sendRecoveryCode(email: AuthEmail): Promise<AuthProcess> {
    try {
      const recoveryFlow = await this.kratosClient.createNativeRecoveryFlow()

      await this.kratosClient.updateRecoveryFlow({
        flow: recoveryFlow.data.id,
        updateRecoveryFlowBody: {
          method: 'code',
          email,
        },
      })

      const authProcess = AuthProcess.recovery({ id: recoveryFlow.data.id })

      return authProcess
    } catch (error) {
      throw new KratosAuthException(AuthProcessType.RECOVERY, { email }, error)
    }
  }

  async confirmRecoveryCode(code: AuthCode, authProcess: AuthProcess): Promise<UserSession> {
    try {
      const { data } = await this.kratosClient.updateRecoveryFlow({
        flow: authProcess.getId(),
        updateRecoveryFlowBody: {
          method: 'code',
          code,
        },
      })

      assert.ok(
        data.state === RecoveryFlowState.PassedChallenge,
        new AssertionError({ message: 'The recovery code is incorrect' })
      )

      const continueWith = data.continue_with?.find(
        (item) => item.action === 'set_ory_session_token'
      )

      assert.ok(
        continueWith?.ory_session_token,
        new AssertionError({ message: 'No session token returned' })
      )

      const session = new UserSession({ token: continueWith.ory_session_token })

      return session
    } catch (error) {
      throw new KratosAuthException(AuthProcessType.RECOVERY, { code, authProcess }, error)
    }
  }
}
