import { GenericContainer }          from 'testcontainers'
import { Wait }                      from 'testcontainers'

import { GcsServerStartedContainer } from './gcs-server.started-container.js'

export class GcsServerContainer extends GenericContainer {
  constructor(image: string) {
    super(image)

    this.withWaitStrategy(Wait.forLogMessage('server started at'))
  }

  // @ts-expect-error
  public async start(): Promise<GcsServerStartedContainer> {
    // @ts-expect-error
    return new GcsServerStartedContainer(await super.start())
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected async preCreate(boundPorts: any): Promise<void> {
    this.withCmd([
      '-scheme',
      'http',
      '-external-url',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      `http://localhost:${boundPorts.getBinding(4443).toString() as string}`,
    ])
  }
}
