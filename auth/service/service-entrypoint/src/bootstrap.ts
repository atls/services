import type { NestFastifyApplication }  from '@nestjs/platform-fastify'

import { MicroservisesRegistry }        from '@atls/nestjs-microservices-registry'
import { NestFactory }                  from '@nestjs/core'
import { FastifyAdapter }               from '@nestjs/platform-fastify'

import { ConnectRpcExceptionsFilter }   from '@auth/infrastructure-module'

import { LISTEN_PORT }                  from './users-service-entrypoint.constants.js'
import { UsersServiceEntrypointModule } from './users-service-entrypoint.module.js'

export const bootstrap = async (): Promise<NestFastifyApplication> => {
  const app = await NestFactory.create<NestFastifyApplication>(
    UsersServiceEntrypointModule,
    new FastifyAdapter()
  )

  app.enableShutdownHooks()
  app.useGlobalFilters(new ConnectRpcExceptionsFilter())

  app
    .get<typeof MicroservisesRegistry>(MicroservisesRegistry, { strict: false })
    .connect(app, { inheritAppConfig: true })

  await app.startAllMicroservices()
  await app.init()
  await app.listen(LISTEN_PORT)

  return app
}
