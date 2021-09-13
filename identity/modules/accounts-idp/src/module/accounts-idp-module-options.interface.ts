import { ModuleMetadata, Type } from '@nestjs/common/interfaces'

export interface AccountsIdpModuleOptions {}

export interface AccountsIdpOptionsFactory {
  createAccountsIdpOptions(): Promise<AccountsIdpModuleOptions> | AccountsIdpModuleOptions
}

export interface AccountsIdpModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<AccountsIdpOptionsFactory>
  useClass?: Type<AccountsIdpOptionsFactory>
  useFactory?: (...args: any[]) => Promise<AccountsIdpModuleOptions> | AccountsIdpModuleOptions
  inject?: any[]
}
