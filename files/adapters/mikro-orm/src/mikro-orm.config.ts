import { Migrator }                     from '@mikro-orm/migrations'
import { PostgreSqlDriver }             from '@mikro-orm/postgresql'
import { defineConfig }                 from '@mikro-orm/postgresql'

import * as entities                    from './entities/index.js'
import * as migrations                  from './migrations/index.js'
import { POSTGRESQL_PORT_FALLBACK }     from './constants/index.js'
import { POSTGRESQL_HOST_FALLBACK }     from './constants/index.js'
import { POSTGRESQL_DATABASE_FALLBACK } from './constants/index.js'
import { POSTGRESQL_USER_FALLBACK }     from './constants/index.js'
import { POSTGRESQL_PASSWORD_FALLBACK } from './constants/index.js'

export default defineConfig({
  port: POSTGRESQL_PORT_FALLBACK,
  host: process.env.POSTGRESQL_HOST ?? POSTGRESQL_HOST_FALLBACK,
  dbName: process.env.POSTGRESQL_DATABASE ?? POSTGRESQL_DATABASE_FALLBACK,
  user: process.env.POSTGRESQL_USER ?? POSTGRESQL_USER_FALLBACK,
  password: process.env.POSTGRESQL_PASSWORD ?? POSTGRESQL_PASSWORD_FALLBACK,
  extensions: [Migrator],
  driver: PostgreSqlDriver,
  entities: Object.values(entities),
  entitiesTs: Object.values(entities),
  debug: false,
  forceUndefined: true,
  migrations: {
    migrationsList: Object.values(migrations).map((migration) => ({
      name: `${migration.name}.ts`,
      class: migration,
    })),
    snapshot: false,
    allOrNothing: true,
    safe: true,
    dropTables: false,
    disableForeignKeys: false,
    transactional: true,
    emit: 'ts',
  },
})
