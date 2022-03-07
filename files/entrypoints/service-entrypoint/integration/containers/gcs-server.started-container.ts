import { AbstractStartedContainer } from 'testcontainers/dist/modules/abstract-started-container'

export class GcsServerStartedContainer extends AbstractStartedContainer {
  public getApiEndpoint() {
    return `http://127.0.0.1:${this.startedTestContainer.getMappedPort(4443)}`
  }
}
