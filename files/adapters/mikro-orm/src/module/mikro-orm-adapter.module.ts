import type { DynamicModule }                from '@nestjs/common'
import type { OnModuleInit }                 from '@nestjs/common'

import type { DatabaseOptions }              from '../interfaces/index.js'
import type { MikroOrmAdapterModuleOptions } from '../interfaces/index.js'

import { MikroORM }                          from '@mikro-orm/core'
import { MikroOrmModule }                    from '@mikro-orm/nestjs'
import { Module }                            from '@nestjs/common'

import { DATABASE_OPTIONS }                  from '../constants/index.js'
import { createProviders }                   from './mikro-orm-adapter.providers.js'
import mikroOrmConfig                        from '../mikro-orm.config.js'

@Module({})
export class MikroOrmAdapterModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  static register(options?: MikroOrmAdapterModuleOptions): DynamicModule {
    const providers = createProviders(options)

    return {
      global: true,
      module: MikroOrmAdapterModule,
      imports: [
        ...(options?.imports || []),
        MikroOrmModule.forRootAsync({
          useFactory: (databaseOptions: DatabaseOptions) => ({
            ...mikroOrmConfig,
            ...options?.config,
            ...databaseOptions,
          }),
          inject: [DATABASE_OPTIONS],
        }),
      ],
      providers,
      exports: [MikroOrmModule, DATABASE_OPTIONS],
    }
  }

  async onModuleInit(): Promise<void> {
    const migrator = this.orm.getMigrator()

    const migrationNeeded = await migrator.checkMigrationNeeded()

    if (migrationNeeded) await migrator.up()
  }
}
