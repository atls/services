import { GenericContainer }          from 'testcontainers'
import { Wait }                      from 'testcontainers'

import { GcsServerStartedContainer } from './gcs-server.started-container.js'

export class GcsServerContainer extends GenericContainer {
  constructor(image: string) {
    super(image)

    this.withCopyContentToContainer([{ content: 'bucket mock', target: '/data/test/mock.txt' }])
    this.withWaitStrategy(Wait.forLogMessage('server started at'))
    this.withCommand(['-scheme', 'http'])
    this.withExposedPorts(4443)
  }

  public async start(): Promise<GcsServerStartedContainer> {
    return new GcsServerStartedContainer(await super.start())
  }
}
