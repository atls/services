import type { DynamicModule }       from '@nestjs/common'
import type { ConfigModuleOptions } from '@nestjs/config'

import { Module }                   from '@nestjs/common'
import { ConfigModule }             from '@nestjs/config'

@Module({})
export class ConfigAdapterModule {
  static register(options?: ConfigModuleOptions): DynamicModule {
    return {
      global: true,
      module: ConfigAdapterModule,
      imports: [ConfigModule.forRoot({ isGlobal: true, ...options })],
    }
  }
}
