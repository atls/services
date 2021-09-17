import { NestFactory }            from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'

import { AccountsAppModule }      from './accounts-app.module'

declare const module: any

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AccountsAppModule)

  app.enableShutdownHooks()

  await app.listen(3000)

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}

bootstrap()
