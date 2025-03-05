import type { DatabaseOptions }         from '@files/mikro-orm-adapter'

import { POSTGRESQL_PORT_FALLBACK }     from '@files/mikro-orm-adapter'
import { POSTGRESQL_HOST_FALLBACK }     from '@files/mikro-orm-adapter'
import { POSTGRESQL_DATABASE_FALLBACK } from '@files/mikro-orm-adapter'
import { POSTGRESQL_USER_FALLBACK }     from '@files/mikro-orm-adapter'
import { POSTGRESQL_PASSWORD_FALLBACK } from '@files/mikro-orm-adapter'
import { registerAs }                   from '@files/config-adapter'

export const databaseConfig = registerAs(
  'database',
  (): DatabaseOptions => ({
    port: POSTGRESQL_PORT_FALLBACK,
    host: process.env.POSTGRESQL_HOST ?? POSTGRESQL_HOST_FALLBACK,
    dbName: process.env.POSTGRESQL_DATABASE ?? POSTGRESQL_DATABASE_FALLBACK,
    user: process.env.POSTGRESQL_USER ?? POSTGRESQL_USER_FALLBACK,
    password: process.env.POSTGRESQL_PASSWORD ?? POSTGRESQL_PASSWORD_FALLBACK,
  })
)
