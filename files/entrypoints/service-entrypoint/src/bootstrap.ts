import { NestLogger }                   from '@atls/nestjs-logger'
import { NestFactory }                  from '@nestjs/core'

import { serverOptions }                from '@files/grpc-adapter-module'

import { FilesServiceEntrypointModule } from './files-service-entrypoint.module.js'

// eslint-disable-next-line
declare const module: any

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(FilesServiceEntrypointModule, {
    logger: new NestLogger(),
  })

  app.connectMicroservice(serverOptions)

  app.enableShutdownHooks()

  await app.startAllMicroservices()
  await app.listen(3000)

  if (module.hot) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    module.hot.accept()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    module.hot.dispose(async () => {
      await app.close()
    })
  }
}

bootstrap()
