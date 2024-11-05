import * as entities   from './src/entities/index.js'
import * as migrations from './src/migrations/index.js'

export default {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'db',
  migrations: Object.values(migrations),
  entities: Object.values(entities),
  uuidExtension: 'pgcrypto',
  logging: true,
  cli: {
    migrationsDir: 'src/migrations',
  },
}
