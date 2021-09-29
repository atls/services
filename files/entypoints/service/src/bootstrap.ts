import { NestFactory }        from '@nestjs/core'
import { NestLogger }         from '@atls/nestjs-logger'

import { serverOptions }      from '@atls/services-proto-files'

import { FilesServiceModule } from './files-service.module'

declare const module: any

const bootstrap = async () => {
  const app = await NestFactory.create(FilesServiceModule, {
    logger: new NestLogger(),
  })

  app.connectMicroservice(serverOptions)

  app.enableShutdownHooks()

  await app.startAllMicroservicesAsync()
  await app.listen(3000)

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}

bootstrap()
