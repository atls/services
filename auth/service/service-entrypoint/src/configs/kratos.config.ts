import type { KratosConfig }   from '@auth/infrastructure-module'

import { registerAs }          from '@nestjs/config'

import { KRATOS_URL_FALLBACK } from '@auth/infrastructure-module'

export const kratosConfig = registerAs(
  'kratos',
  (): KratosConfig => ({
    url: process.env.KRATOS_URL ?? KRATOS_URL_FALLBACK,
  })
)
