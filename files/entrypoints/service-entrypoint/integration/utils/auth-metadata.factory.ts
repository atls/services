import { Metadata }       from '@grpc/grpc-js'
import { promises as fs } from 'fs'
import { sign }           from 'jsonwebtoken'

export class AuthMetadataFactory {
  private privateKey: undefined | string

  constructor(private readonly privateKeyPath: string) {}

  private async getPrivateKey() {
    if (!this.privateKey) {
      this.privateKey = await fs.readFile(this.privateKeyPath, 'utf-8')
    }

    return this.privateKey
  }

  async createMetadata(sub: string) {
    const metadata = new Metadata()

    const token = sign({ sub }, await this.getPrivateKey(), { algorithm: 'RS256' })

    metadata.add('authorization', `Bearer ${token}`)

    return metadata
  }
}
