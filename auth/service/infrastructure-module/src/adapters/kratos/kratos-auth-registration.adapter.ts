import type { KratosConfig }        from '../../interfaces/index.js'

import { AssertionError }           from 'node:assert'
import assert                       from 'node:assert'

import { Injectable }               from '@nestjs/common'
import { ConfigService }            from '@nestjs/config'
import { Configuration }            from '@ory/kratos-client'
import { FrontendApi }              from '@ory/kratos-client'

import { AuthPhone }                from '@auth/application-module'
import { AuthRegistrationResponse } from '@auth/application-module'
import { AuthRegistrationPort }     from '@auth/application-module'
import { AuthEmail }                from '@auth/application-module'
import { AuthPassword }             from '@auth/application-module'
import { AuthProcess }              from '@auth/domain-module'
import { UserSession }              from '@auth/domain-module'
import { AuthProcessType }          from '@auth/domain-module'

import { KratosAuthException }      from '../../exceptions/index.js'

@Injectable()
export class KratosAuthRegistrationAdapter implements AuthRegistrationPort {
  private readonly kratosClient: FrontendApi

  constructor(private configService: ConfigService) {
    const kratosUrl = this.configService.get<KratosConfig['url']>('kratos.url')

    this.kratosClient = new FrontendApi(new Configuration({ basePath: kratosUrl }))
  }

  async registerByEmail(
    email: AuthEmail,
    password: AuthPassword
  ): Promise<AuthRegistrationResponse> {
    try {
      const registrationFlow = await this.kratosClient.createNativeRegistrationFlow({}, {})

      const { data } = await this.kratosClient.updateRegistrationFlow({
        flow: registrationFlow.data.id,
        updateRegistrationFlowBody: {
          method: 'password',
          password,
          traits: { email },
        },
      })

      const continueWith = data.continue_with?.find(
        (item) => item.action === 'show_verification_ui'
      )

      assert.ok(continueWith?.flow.id, new AssertionError({ message: 'No flow id returned' }))

      const authProcess = AuthProcess.verification({ id: continueWith.flow.id })

      assert.ok(data.session_token, new AssertionError({ message: 'No session token returned' }))

      const userSession = new UserSession({
        token: data.session_token,
        account: { id: data.identity.id, email },
      })

      return { authProcess, userSession }
    } catch (error) {
      throw new KratosAuthException(AuthProcessType.REGISTRATION, { email }, error)
    }
  }

  async registerByPhone(
    phone: AuthPhone,
    password: AuthPassword
  ): Promise<AuthRegistrationResponse> {
    try {
      const registrationFlow = await this.kratosClient.createNativeRegistrationFlow()

      const { data } = await this.kratosClient.updateRegistrationFlow({
        flow: registrationFlow.data.id,
        updateRegistrationFlowBody: {
          method: 'password',
          password,
          traits: { phone },
        },
      })

      const continueWith = data.continue_with?.find(
        (item) => item.action === 'show_verification_ui'
      )

      assert.ok(continueWith?.flow.id, new AssertionError({ message: 'No flow id returned' }))

      const authProcess = AuthProcess.verification({ id: continueWith.flow.id })

      assert.ok(data.session_token, new AssertionError({ message: 'No session token returned' }))

      const userSession = new UserSession({
        token: data.session_token,
        account: { id: data.identity.id, phone },
      })

      return { authProcess, userSession }
    } catch (error) {
      throw new KratosAuthException(AuthProcessType.REGISTRATION, { phone }, error)
    }
  }
}
