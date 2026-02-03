import type { IdentityApi } from '@ory/kratos-client'

export type KratosClient = IdentityApi

export type { Identity } from '@ory/kratos-client'

export interface KratosError {
  message: string
  details?: string
}

export interface KratosConfig {
  url: string
  publicExternalUrl?: string
}
