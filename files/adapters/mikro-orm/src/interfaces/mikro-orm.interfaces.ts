import type { Options }        from '@mikro-orm/postgresql'
import type { ModuleMetadata } from '@nestjs/common'

export type DatabaseOptions = Pick<Options, 'dbName' | 'host' | 'password' | 'port' | 'user'>

export interface MikroOrmAdapterModuleOptions extends Pick<ModuleMetadata, 'imports'> {
  config?: Options
  useFactory?: (...args: Array<any>) => DatabaseOptions | Promise<DatabaseOptions>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inject?: Array<any>
}
