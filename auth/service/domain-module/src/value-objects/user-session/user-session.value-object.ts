import type { UserSessionProps } from './user-session.schema.js'

import { deepEqual }             from 'node:assert/strict'

import { UserAccount }           from '../user-account/index.js'
import { UserSessionSchema }     from './user-session.schema.js'

export class UserSession {
  private readonly token: string

  private readonly account?: UserAccount

  constructor(props: UserSessionProps) {
    const session = UserSessionSchema.parse(props)

    this.token = session.token
    this.account = session.account ? new UserAccount(session.account) : undefined
  }

  getToken(): string {
    return this.token
  }

  getAccount(): UserAccount | undefined {
    return this.account
  }

  toDTO(): UserSessionProps {
    return {
      token: this.token,
      account: this.account?.toDTO(),
    }
  }

  equals(other: UserSession): boolean {
    try {
      deepEqual(this.toDTO(), other.toDTO())
      return true
    } catch {
      return false
    }
  }

  toString(): string {
    return `UserSession: ${JSON.stringify(this.toDTO())}`
  }
}
