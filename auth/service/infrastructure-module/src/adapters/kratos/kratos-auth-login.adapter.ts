import type { KratosConfig }                        from '../../interfaces/index.js'

import { AssertionError }                           from 'node:assert'
import assert                                       from 'node:assert'

import { Injectable }                               from '@nestjs/common'
import { NotFoundException }                        from '@nestjs/common'
import { ConfigService }                            from '@nestjs/config'
import { Configuration }                            from '@ory/kratos-client'
import { FrontendApi }                              from '@ory/kratos-client'
import { UiText }                                   from '@ory/kratos-client'

import { AuthCode }                                 from '@auth/application-module'
import { AuthIdentifier }                           from '@auth/application-module'
import { AuthLoginPort }                            from '@auth/application-module'
import { AuthPhone }                                from '@auth/application-module'
import { AuthEmail }                                from '@auth/application-module'
import { AuthPassword }                             from '@auth/application-module'
import { AuthProcess }                              from '@auth/domain-module'
import { AuthProcessType }                          from '@auth/domain-module'
import { UserAccount }                              from '@auth/domain-module'
import { UserSession }                              from '@auth/domain-module'

import { LOGIN_BY_PHONE_ACCOUNT_NOT_FOUND_MESSAGE } from '../../constants/index.js'
import { KratosAuthException }                      from '../../exceptions/index.js'

@Injectable()
export class KratosAuthLoginAdapter implements AuthLoginPort {
  private readonly kratosClient: FrontendApi

  constructor(private configService: ConfigService) {
    const kratosUrl = this.configService.get<KratosConfig['url']>('kratos.url')

    this.kratosClient = new FrontendApi(new Configuration({ basePath: kratosUrl }))
  }

  async loginByEmail(
    email: AuthEmail,
    password: AuthPassword,
    authProcess?: AuthProcess
  ): Promise<UserSession> {
    try {
      let flowId = authProcess?.getId()

      if (!flowId) {
        const loginFlow = await this.kratosClient.createNativeLoginFlow()
        flowId = loginFlow.data.id
      }

      const { data } = await this.kratosClient.updateLoginFlow({
        flow: flowId,
        updateLoginFlowBody: {
          method: 'password',
          identifier: email,
          password,
        },
      })

      assert.ok(data.session.identity?.id, new AssertionError({ message: 'No identity returned' }))

      const account = new UserAccount({ id: data.session.identity.id })

      assert.ok(data.session_token, new AssertionError({ message: 'No session token returned' }))

      const session = new UserSession({ token: data.session_token, account: account.toDTO() })

      return session
    } catch (error) {
      throw new KratosAuthException(AuthProcessType.LOGIN, { email }, error)
    }
  }

  async loginByPhone(phone: AuthPhone): Promise<AuthProcess> {
    try {
      const loginFlow = await this.kratosClient.createNativeLoginFlow()

      const authProcess = AuthProcess.login({ id: loginFlow.data.id })

      await this.kratosClient
        .updateLoginFlow({
          flow: authProcess.getId(),
          updateLoginFlowBody: {
            method: 'code',
            identifier: phone,
            /**
             * @info csrf_token is required field, but an empty string is allowed for NativeLoginFlow
             * This should be fixed in a future version of @ory/kratos-client
             */
            csrf_token: '',
          },
        })
        /**
         * @info Requesting a login code returns HTTP 400 this is the expected behavior
         * @link https://github.com/ory/kratos/issues/4052
         */
        .catch((error) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          const errorMessage: UiText | undefined = error?.response?.data?.ui?.messages?.find(
            (message: UiText) => message.type === 'error' && message.text
          )

          if (errorMessage?.text === LOGIN_BY_PHONE_ACCOUNT_NOT_FOUND_MESSAGE) {
            throw new NotFoundException(errorMessage.text)
          }
        })

      return authProcess
    } catch (error) {
      throw new KratosAuthException(AuthProcessType.LOGIN, { phone }, error)
    }
  }

  async confirmLoginCode(
    code: AuthCode,
    identifier: AuthIdentifier,
    authProcess: AuthProcess
  ): Promise<UserSession> {
    try {
      const { data } = await this.kratosClient.updateLoginFlow({
        flow: authProcess.getId(),
        updateLoginFlowBody: {
          method: 'code',
          identifier,
          code,
          /**
           * @info csrf_token is required field, but an empty string is allowed for NativeLoginFlow
           * This should be fixed in a future version of @ory/kratos-client
           */
          csrf_token: '',
        },
      })

      assert.ok(data.session.identity?.id, new AssertionError({ message: 'No identity returned' }))

      const account = new UserAccount({ id: data.session.identity.id })

      assert.ok(data.session_token, new AssertionError({ message: 'No session token returned' }))

      const session = new UserSession({ token: data.session_token, account: account.toDTO() })

      return session
    } catch (error) {
      throw new KratosAuthException(
        AuthProcessType.LOGIN,
        { identifier, code, authProcess: authProcess.getId() },
        error
      )
    }
  }
}
