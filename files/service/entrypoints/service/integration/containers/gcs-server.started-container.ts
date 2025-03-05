import { AbstractStartedContainer } from 'testcontainers'

export class GcsServerStartedContainer extends AbstractStartedContainer {
  public getApiEndpoint(): string {
    return `http://127.0.0.1:${this.getMappedPort(4443)}`
  }
}
