import type { SourceOptions } from '@atls/nestjs-gateway'

type SourceHandler = SourceOptions['handler']

export interface Handler extends SourceHandler {
  serviceName: string
  packageName: string
}
