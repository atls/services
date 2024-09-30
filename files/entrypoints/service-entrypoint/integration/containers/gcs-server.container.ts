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
}
