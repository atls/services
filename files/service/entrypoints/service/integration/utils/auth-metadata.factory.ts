import { Metadata }       from '@grpc/grpc-js'
import { promises as fs } from 'fs'
import jsonwebtoken       from 'jsonwebtoken'

const { sign } =
  'default' in jsonwebtoken ? (jsonwebtoken.default as typeof jsonwebtoken) : jsonwebtoken

export class AuthMetadataFactory {
  private privateKey: string | undefined

  constructor(private readonly privateKeyPath: string) {}

  async createMetadata(sub: string): Promise<Metadata> {
    const metadata = new Metadata()

    const token = sign({ sub }, await this.getPrivateKey(), { algorithm: 'RS256' })

    metadata.add('authorization', `Bearer ${token}`)

    return metadata
  }

  private async getPrivateKey(): Promise<string> {
    if (!this.privateKey) {
      this.privateKey = await fs.readFile(this.privateKeyPath, 'utf-8')
    }

    return this.privateKey
  }
}
