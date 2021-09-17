import { ModuleMetadata, Type } from '@nestjs/common/interfaces'

export interface AccountsSsoModuleOptions {}

export interface AccountsSsoOptionsFactory {
  createAccountsSsoOptions(): Promise<AccountsSsoModuleOptions> | AccountsSsoModuleOptions
}

export interface AccountsSsoModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<AccountsSsoOptionsFactory>
  useClass?: Type<AccountsSsoOptionsFactory>
  useFactory?: (...args: any[]) => Promise<AccountsSsoModuleOptions> | AccountsSsoModuleOptions
  inject?: any[]
}
