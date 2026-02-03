import type { KratosConfig }     from '../../interfaces/index.js'

import { AssertionError }        from 'node:assert'
import assert                    from 'node:assert'

import { Injectable }            from '@nestjs/common'
import { ConfigService }         from '@nestjs/config'
import { Configuration }         from '@ory/kratos-client'
import { VerificationFlowState } from '@ory/kratos-client'
import { FrontendApi }           from '@ory/kratos-client'

import { AuthVerificationPort }  from '@auth/application-module'
import { AuthEmail }             from '@auth/application-module'
import { AuthCode }              from '@auth/application-module'
import { AuthProcess }           from '@auth/domain-module'
import { AuthProcessType }       from '@auth/domain-module'

import { KratosAuthException }   from '../../exceptions/index.js'

@Injectable()
export class KratosAuthVerificationAdapter implements AuthVerificationPort {
  private readonly kratosClient: FrontendApi

  constructor(private configService: ConfigService) {
    const kratosUrl = this.configService.get<KratosConfig['url']>('kratos.url')

    this.kratosClient = new FrontendApi(new Configuration({ basePath: kratosUrl }))
  }

  async sendVerificationCode(email: AuthEmail): Promise<AuthProcess> {
    try {
      const verificationFlow = await this.kratosClient.createNativeVerificationFlow()

      await this.kratosClient.updateVerificationFlow({
        flow: verificationFlow.data.id,
        updateVerificationFlowBody: {
          method: 'code',
          email,
        },
      })

      const authProcess = AuthProcess.verification({ id: verificationFlow.data.id })

      return authProcess
    } catch (error) {
      throw new KratosAuthException(AuthProcessType.VERIFICATION, { email }, error)
    }
  }

  async confirmVerificationCode(code: AuthCode, authProcess: AuthProcess): Promise<void> {
    try {
      const { data } = await this.kratosClient.updateVerificationFlow({
        flow: authProcess.getId(),
        updateVerificationFlowBody: {
          method: 'code',
          code,
        },
      })

      assert.ok(
        data.state === VerificationFlowState.PassedChallenge,
        new AssertionError({ message: 'The verification code is incorrect' })
      )
    } catch (error) {
      throw new KratosAuthException(AuthProcessType.VERIFICATION, { code, authProcess }, error)
    }
  }
}
