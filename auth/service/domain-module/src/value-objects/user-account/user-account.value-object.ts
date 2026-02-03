import type { UserAccountProps } from './user-account.schema.js'

import { deepEqual }             from 'node:assert/strict'

import { UserAccountSchema }     from './user-account.schema.js'

export class UserAccount {
  private readonly id: string

  private readonly email?: string

  private readonly phone?: string

  constructor(props: UserAccountProps) {
    const account = UserAccountSchema.parse(props)

    this.id = account.id
    this.email = account.email
    this.phone = account.phone
  }

  getId(): string {
    return this.id
  }

  toDTO(): UserAccountProps {
    return {
      id: this.id,
      email: this.email,
      phone: this.phone,
    }
  }

  equals(other: UserAccount): boolean {
    try {
      deepEqual(this.toDTO(), other.toDTO())
      return true
    } catch {
      return false
    }
  }

  toString(): string {
    return `UserAccount: ${JSON.stringify(this.toDTO())}`
  }
}
