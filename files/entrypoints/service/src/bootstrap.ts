import type { NestFastifyApplication } from '@nestjs/platform-fastify'

import { NestLogger }                  from '@atls/nestjs-logger'
import { NestFactory }                 from '@nestjs/core'
import { FastifyAdapter }              from '@nestjs/platform-fastify'

import { serverOptions }               from '@files/grpc-adapter'

import { LISTEN_PORT }                 from './service-entrypoint.constants.js'
import { ServiceEntrypointModule }     from './service-entrypoint.module.js'
import { module }                      from './service-entrypoint.interfaces.js'

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create<NestFastifyApplication>(
    ServiceEntrypointModule,
    new FastifyAdapter(),
    { logger: new NestLogger() }
  )

  app.connectMicroservice(serverOptions)
  app.enableShutdownHooks()

  await app.startAllMicroservices()
  await app.listen(LISTEN_PORT)

  if (module?.hot) {
    module?.hot.accept()
    module?.hot.dispose((): void => {
      app.close()
    })
  }
}

bootstrap()
