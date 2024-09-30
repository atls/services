// @ts-expect-error
import { AbstractStartedContainer } from 'testcontainers/dist/modules/abstract-started-container'

export class GcsServerStartedContainer extends AbstractStartedContainer {
  public getApiEndpoint(): string {
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/restrict-template-expressions
    return `http://127.0.0.1:${this.startedTestContainer.getMappedPort(4443)}`
  }
}
