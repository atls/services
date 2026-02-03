import type { SettingsFlow }   from '@ory/kratos-client'

import type { KratosConfig }   from '../../interfaces/index.js'

import { AssertionError }      from 'node:assert'
import assert                  from 'node:assert'

import { Injectable }          from '@nestjs/common'
import { ConfigService }       from '@nestjs/config'
import { Configuration }       from '@ory/kratos-client'
import { SettingsFlowState }   from '@ory/kratos-client'
import { FrontendApi }         from '@ory/kratos-client'
import { IdentityApi }         from '@ory/kratos-client'

import { AuthSettingsPort }    from '@auth/application-module'
import { AuthEmail }           from '@auth/application-module'
import { AuthPassword }        from '@auth/application-module'
import { AuthToken }           from '@auth/application-module'
import { AuthProcess }         from '@auth/domain-module'
import { AuthProcessType }     from '@auth/domain-module'
import { UserAccount }         from '@auth/domain-module'
import { UserSession }         from '@auth/domain-module'

import { KratosAuthException } from '../../exceptions/index.js'

@Injectable()
export class KratosAuthSettingsAdapter implements AuthSettingsPort {
  private readonly kratosFrontendClient: FrontendApi

  private readonly kratosIdentityClient: IdentityApi

  constructor(private configService: ConfigService) {
    const kratosUrl = this.configService.get<KratosConfig['url']>('kratos.url')

    this.kratosFrontendClient = new FrontendApi(new Configuration({ basePath: kratosUrl }))
    this.kratosIdentityClient = new IdentityApi(new Configuration({ basePath: kratosUrl }))
  }

  async getSessionByToken(token: AuthToken): Promise<UserSession> {
    try {
      const { data } = await this.kratosFrontendClient.toSession({
        xSessionToken: token,
      })

      const account = new UserAccount({
        id: data.identity?.id || '',
        email: data.identity?.traits?.email,
        phone: data.identity?.traits?.phone,
      })

      const session = new UserSession({ token, account: account.toDTO() })

      return session
    } catch (error) {
      throw new KratosAuthException(AuthProcessType.SETTINGS, { token }, error)
    }
  }

  async updatePassword(newPassword: AuthPassword, token: AuthToken): Promise<void> {
    try {
      const settingsFlow = await this.kratosFrontendClient.createNativeSettingsFlow({
        xSessionToken: token,
      })

      const { data } = await this.kratosFrontendClient.updateSettingsFlow({
        flow: settingsFlow.data.id,
        xSessionToken: token,
        updateSettingsFlowBody: {
          method: 'password',
          password: newPassword,
        },
      })

      this.assertSettingStateSuccess(data.state)
    } catch (error) {
      throw new KratosAuthException(AuthProcessType.SETTINGS, { token }, error)
    }
  }

  async updateEmail(newEmail: AuthEmail, token: AuthToken): Promise<AuthProcess> {
    try {
      const settingsFlow = await this.kratosFrontendClient.createNativeSettingsFlow({
        xSessionToken: token,
      })

      const { data } = await this.kratosFrontendClient.updateSettingsFlow({
        flow: settingsFlow.data.id,
        xSessionToken: token,
        updateSettingsFlowBody: {
          method: 'profile',
          traits: { email: newEmail },
        },
      })

      this.assertSettingStateSuccess(data.state)

      const continueWith = data.continue_with?.find(
        (item) => item.action === 'show_verification_ui'
      )

      assert.ok(continueWith?.flow.id, new AssertionError({ message: 'No flow id returned' }))

      const authProcess = AuthProcess.settings({ id: continueWith.flow.id })

      return authProcess
    } catch (error) {
      throw new KratosAuthException(AuthProcessType.SETTINGS, { newEmail, token }, error)
    }
  }

  async deleteAccount(accountId: UserAccount['id']): Promise<void> {
    try {
      await this.kratosIdentityClient.deleteIdentity({ id: accountId })
    } catch (error) {
      throw new KratosAuthException(AuthProcessType.SETTINGS, { accountId }, error)
    }
  }

  private assertSettingStateSuccess(state: SettingsFlow['state']): void {
    assert.ok(
      state === SettingsFlowState.Success,
      new AssertionError({ message: 'The update status is not success' })
    )
  }
}
