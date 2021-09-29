import { GRPC_IDENTITY_MODULE_OPTIONS } from '@atls/nestjs-grpc-identity'
import { TypeOrmSeedingModule }         from '@atls/nestjs-typeorm-seeding'
import { SeederFactory }                from '@atls/nestjs-typeorm-seeding'
import { GenericContainer }             from 'testcontainers'
import { StartedTestContainer }         from 'testcontainers'
import { Wait }                         from 'testcontainers'
import { INestMicroservice }            from '@nestjs/common'
import { Test }                         from '@nestjs/testing'
import { TYPA_MODULE_OPTIONS }          from '@typa/common'
import { StorageType }                  from '@typa/common'
import getPort                          from 'get-port'
import { v4 as uuid }                   from 'uuid'
import { promises as fs }               from 'fs'
import { join }                         from 'path'

import { FilesServiceClientModule }     from '@atls/services-proto-files'
import { FILES_SERVICE_CLIENT_TOKEN }   from '@atls/services-proto-files'
import { FilesServiceClient }           from '@atls/services-proto-files'
import { serverOptions }                from '@atls/services-proto-files'
import { FILES_STORAGE_MODULE_OPTIONS } from '@files/storage-adapter-module'
import { FileEntity }                   from '@files/projection-module'

import { FilesServiceModule }           from '../src/files-service.module'
import { AuthMetadataFactory }          from './utils'

jest.setTimeout(60000)

describe('files grpc adapter', () => {
  let postgres: StartedTestContainer
  let service: INestMicroservice
  let client: FilesServiceClient
  let seederFactory: SeederFactory

  const metadataFactory = new AuthMetadataFactory(join(__dirname, 'fixtures/.jwks.pem'))

  beforeAll(async () => {
    postgres = await new GenericContainer('bitnami/postgresql')
      .withWaitStrategy(Wait.forLogMessage('database system is ready to accept connections'))
      .withEnv('POSTGRESQL_PASSWORD', 'password')
      .withEnv('POSTGRESQL_DATABASE', 'db')
      .withExposedPorts(5432)
      .start()

    const port = await getPort()

    const module = await Test.createTestingModule({
      imports: [
        FilesServiceClientModule.register({ url: `0.0.0.0:${port}` }),
        TypeOrmSeedingModule.register(),
        FilesServiceModule,
      ],
    })
      .overrideProvider(FILES_STORAGE_MODULE_OPTIONS)
      .useValue({
        apiEndpoint: 'http://localhost:8000',
        keyFilename: join(__dirname, 'fixtures/fake-google-credentials.json'),
      })
      .overrideProvider(TYPA_MODULE_OPTIONS)
      .useValue({
        storage: {
          type: StorageType.postgres,
          host: 'localhost',
          database: 'db',
          username: 'postgres',
          password: 'password',
          port: postgres.getMappedPort(5432),
        },
      })
      .overrideProvider(GRPC_IDENTITY_MODULE_OPTIONS)
      .useValue({
        jwks: {
          jwksUri: join(__dirname, 'fixtures/.jwks.json'),
          fetcher: async (jwksUri) => {
            const data = await fs.readFile(jwksUri)

            return JSON.parse(data.toString())
          },
          cache: true,
          jwksRequestsPerMinute: 5,
        },
      })
      .compile()

    service = module.createNestMicroservice({
      ...serverOptions,
      options: {
        ...serverOptions.options,
        url: `0.0.0.0:${port}`,
      },
    })

    await service.listenAsync()

    client = module.get<FilesServiceClient>(FILES_SERVICE_CLIENT_TOKEN)
    seederFactory = module.get(SeederFactory)
  })

  afterAll(async () => {
    await service.close()
    await postgres.stop()
  })

  it('check owned files id query', async () => {
    const ownerId = uuid()

    const seeds = await seederFactory.for(FileEntity).with({ ownerId }).create(2)
    const metadata = await metadataFactory.createMetadata(ownerId)

    const { files: eqFiles } = await client
      .listOwnedFiles(
        {
          query: {
            id: {
              eq: seeds[0].id,
            },
          },
        },
        metadata
      )
      .toPromise()

    const { files: inFiles } = await client
      .listOwnedFiles(
        {
          query: {
            id: {
              in: [seeds[0].id],
            },
          },
        },
        metadata
      )
      .toPromise()

    expect(eqFiles[0].id).toBe(seeds[0].id)
    expect(inFiles[0].id).toBe(seeds[0].id)
    expect(eqFiles.length).toBe(inFiles.length)
  })
})
