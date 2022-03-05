import { GenericContainer }          from 'testcontainers'
import { Wait }                      from 'testcontainers'

import { GcsServerStartedContainer } from './gcs-server.started-container'

export class GcsServerContainer extends GenericContainer {
  constructor(image) {
    super(image)

    this.withWaitStrategy(Wait.forLogMessage('server started at'))
  }

  protected async preCreate(boundPorts): Promise<void> {
    this.withCmd([
      '-scheme',
      'http',
      '-external-url',
      `http://localhost:${boundPorts.getBinding(4443)}`,
    ])
  }

  public async start(): Promise<GcsServerStartedContainer> {
    return new GcsServerStartedContainer(await super.start())
  }
}
