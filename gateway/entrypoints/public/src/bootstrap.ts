import type { NestExpressApplication } from '@nestjs/platform-express'

import { NestLogger }                  from '@atls/nestjs-logger'
import { NestFactory }                 from '@nestjs/core'
import { json }                        from 'body-parser/index.js'
import { urlencoded }                  from 'body-parser/index.js'

import { LISTEN_PORT }                 from './public-gateway.constants.js'
import { MAX_REQUEST_LIMIT_SIZE }      from './public-gateway.constants.js'
import { PublicGatewayModule }         from './public-gateway.module.js'
import { module }                      from './public-gateway.interfaces.js'
import { disableAllowOriginsHeader }   from './utils/index.js'

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create<NestExpressApplication>(PublicGatewayModule, {
    logger: new NestLogger(),
  })

  app.enableShutdownHooks()

  app.use(disableAllowOriginsHeader)

  app.use(json({ limit: MAX_REQUEST_LIMIT_SIZE }))
  app.use(urlencoded({ limit: MAX_REQUEST_LIMIT_SIZE, extended: true }))

  await app.listen(LISTEN_PORT)

  if (module?.hot) {
    module?.hot.accept()
    module?.hot.dispose((): void => {
      app.close()
    })
  }
}

bootstrap()
