import type { Provider }                     from '@nestjs/common'

import type { MikroOrmAdapterModuleOptions } from '../interfaces/index.js'

import { DATABASE_OPTIONS }                  from '../constants/index.js'

export const createProviders = (options?: MikroOrmAdapterModuleOptions): Array<Provider> => {
  const providers: Array<Provider> = []

  if (options?.useFactory) {
    providers.push({
      provide: DATABASE_OPTIONS,
      useFactory: options?.useFactory,
      inject: options?.inject,
    })
  }

  return providers
}
