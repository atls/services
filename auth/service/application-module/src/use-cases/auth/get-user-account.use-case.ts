import type { UserAccount }    from '@auth/domain-module'

import assert                  from 'node:assert'

import { Inject }              from '@nestjs/common'
import { Logger }              from '@nestjs/common'

import { AUTH_SETTINGS_PORT }  from '../../constants/index.js'
import { AuthSettingsPort }    from '../../ports/auth/index.js'
import { GetUserAccountQuery } from '../../queries/index.js'

export class GetUserAccountUseCase {
  private readonly logger = new Logger(GetUserAccountUseCase.name)

  constructor(@Inject(AUTH_SETTINGS_PORT) private readonly authPort: AuthSettingsPort) {}

  async execute(query: GetUserAccountQuery): Promise<UserAccount> {
    try {
      const session = await this.authPort.getSessionByToken(query.sessionToken)

      const userAccount = session.getAccount()

      assert.ok(userAccount, `User account not found for token ${query.sessionToken}`)

      return userAccount
    } catch (error) {
      this.logger.error(`Error executing ${GetUserAccountUseCase.name}`)
      throw error
    }
  }
}
