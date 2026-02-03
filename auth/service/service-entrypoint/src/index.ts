import { bootstrap } from './bootstrap.js'

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('[Bootstrap Error]', error)
  // eslint-disable-next-line n/no-process-exit
  process.exit(1)
})
