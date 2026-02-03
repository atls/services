import type { AuthProvider }    from '@auth/application-module'

import type { KratosConfig }    from '../../interfaces/index.js'

import { AssertionError }       from 'node:assert'
import assert                   from 'node:assert'

import { Injectable }           from '@nestjs/common'
import { ConfigService }        from '@nestjs/config'
import { Configuration }        from '@ory/kratos-client'
import { FrontendApi }          from '@ory/kratos-client'

import { AuthSsoPort }          from '@auth/application-module'
import { AuthSsoLoginResponse } from '@auth/application-module'
import { AuthProcess }          from '@auth/domain-module'
import { AuthProcessType }      from '@auth/domain-module'
import { UserAccount }          from '@auth/domain-module'
import { UserSession }          from '@auth/domain-module'

import { KratosAuthException }  from '../../exceptions/index.js'

@Injectable()
export class KratosAuthSsoAdapter implements AuthSsoPort {
  private readonly kratosClient: FrontendApi

  constructor(private configService: ConfigService) {
    const kratosUrl = this.configService.get<KratosConfig['url']>('kratos.url')

    this.kratosClient = new FrontendApi(new Configuration({ basePath: kratosUrl }))
  }

  async loginByProvider(
    provider: AuthProvider,
    idToken: string,
    nonce: string
  ): Promise<AuthSsoLoginResponse> {
    try {
      const loginFlow = await this.kratosClient.createNativeLoginFlow()

      const { data } = await this.kratosClient.updateLoginFlow({
        flow: loginFlow.data.id,
        updateLoginFlowBody: {
          method: 'oidc',
          provider,
          id_token: idToken,
          id_token_nonce: nonce,
        },
      })

      if (!data.session_token && 'id' in data && typeof data.id === 'string') {
        return { authProcess: AuthProcess.login({ id: data.id }) }
      }

      assert.ok(data.session_token, new AssertionError({ message: 'No session token returned' }))

      const account = new UserAccount({
        id: data.session.identity?.id || '',
        email: data.session.identity?.traits?.email,
        phone: data.session.identity?.traits?.phone,
      })

      const userSession = new UserSession({
        token: data.session_token,
        account: account.toDTO(),
      })

      return { userSession }
    } catch (error) {
      throw new KratosAuthException(AuthProcessType.LOGIN, { provider }, error)
    }
  }
}
