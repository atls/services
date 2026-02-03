import type { AuthProcessProps }       from './auth-process.schema.js'
import type { AuthProcessWithoutType } from './auth-process.schema.js'

import { deepEqual }                   from 'node:assert/strict'

import { AuthProcessType }             from '../../enums/index.js'
import { AuthProcessSchema }           from './auth-process.schema.js'

export class AuthProcess {
  private readonly id: string

  private readonly type: AuthProcessType

  constructor(props: AuthProcessProps) {
    const authProcess = AuthProcessSchema.parse(props)

    this.id = authProcess.id
    this.type = authProcess.type
  }

  static login(props: AuthProcessWithoutType): AuthProcess {
    return new AuthProcess({ ...props, type: AuthProcessType.LOGIN })
  }

  static registration(props: AuthProcessWithoutType): AuthProcess {
    return new AuthProcess({ ...props, type: AuthProcessType.REGISTRATION })
  }

  static recovery(props: AuthProcessWithoutType): AuthProcess {
    return new AuthProcess({ ...props, type: AuthProcessType.RECOVERY })
  }

  static verification(props: AuthProcessWithoutType): AuthProcess {
    return new AuthProcess({ ...props, type: AuthProcessType.VERIFICATION })
  }

  static settings(props: AuthProcessWithoutType): AuthProcess {
    return new AuthProcess({ ...props, type: AuthProcessType.SETTINGS })
  }

  getId(): string {
    return this.id
  }

  getType(): AuthProcessType {
    return this.type
  }

  toDTO(): AuthProcessProps {
    return {
      id: this.id,
      type: this.type,
    }
  }

  equals(other: AuthProcess): boolean {
    try {
      deepEqual(this.toDTO(), other.toDTO())
      return true
    } catch {
      return false
    }
  }

  toString(): string {
    return `AuthProcess: ${JSON.stringify(this.toDTO())}`
  }
}
