import { NestLogger }                         from '@atls/nestjs-logger'
import { MicroservisesRegistry }              from '@atls/nestjs-microservices-registry'
import { NestFactory }                        from '@nestjs/core'

import { FilesEngineServiceEntrypointModule } from './files-engine-service-entrypoint.module.js'

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(FilesEngineServiceEntrypointModule, {
    logger: new NestLogger(),
  })

  app.enableShutdownHooks()

  app
    .get<typeof MicroservisesRegistry>(MicroservisesRegistry, { strict: false })
    .connect(app, { inheritAppConfig: true })

  await app.startAllMicroservices()
  await app.listen(3000)

  if (import.meta.webpackHot) {
    import.meta.webpackHot.accept()
    import.meta.webpackHot.dispose(() => {
      app.close()
    })
  }
}

bootstrap()
