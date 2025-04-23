import type { NestFastifyApplication }        from '@nestjs/platform-fastify'

import { NestLogger }                         from '@atls/nestjs-logger'
import { NestFactory }                        from '@nestjs/core'
import { FastifyAdapter }                     from '@nestjs/platform-fastify'

import { LISTEN_PORT }                        from './files-engine-gateway-entrypoint.constants.js'
import { FilesEngineGatewayEntrypointModule } from './files-engine-gateway-entrypoint.module.js'

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create<NestFastifyApplication>(
    FilesEngineGatewayEntrypointModule,
    new FastifyAdapter(),
    { logger: new NestLogger() }
  )

  app.enableShutdownHooks()

  await app.listen(LISTEN_PORT)

  if (import.meta.webpackHot) {
    import.meta.webpackHot.accept()
    import.meta.webpackHot.dispose(() => {
      app.close()
    })
  }
}

bootstrap()
