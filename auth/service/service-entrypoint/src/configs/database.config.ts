import type { DatabaseOptions }         from '@auth/infrastructure-module'

import { registerAs }                   from '@nestjs/config'

import { POSTGRESQL_PORT_FALLBACK }     from '@auth/infrastructure-module'
import { POSTGRESQL_DATABASE_FALLBACK } from '@auth/infrastructure-module'
import { POSTGRESQL_HOST_FALLBACK }     from '@auth/infrastructure-module'
import { POSTGRESQL_PASSWORD_FALLBACK } from '@auth/infrastructure-module'
import { POSTGRESQL_USER_FALLBACK }     from '@auth/infrastructure-module'

const POSTGRESQL_PORT = Number(process.env.POSTGRESQL_PORT)

export const databaseConfig = registerAs(
  'database',
  (): DatabaseOptions => ({
    port: Number.isNaN(POSTGRESQL_PORT) ? POSTGRESQL_PORT_FALLBACK : POSTGRESQL_PORT,
    host: process.env.POSTGRESQL_HOST ?? POSTGRESQL_HOST_FALLBACK,
    name: process.env.POSTGRESQL_DATABASE ?? POSTGRESQL_DATABASE_FALLBACK,
    user: process.env.POSTGRESQL_USER ?? POSTGRESQL_USER_FALLBACK,
    password: process.env.POSTGRESQL_PASSWORD ?? POSTGRESQL_PASSWORD_FALLBACK,
  })
)
