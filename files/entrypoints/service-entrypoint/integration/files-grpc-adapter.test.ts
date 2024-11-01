import type { FilesServiceClient }             from '@atls/services-proto-files'
import type { INestMicroservice }              from '@nestjs/common'
import type { StartedTestContainer }           from 'testcontainers'

import { GRPC_IDENTITY_MODULE_OPTIONS }        from '@atls/nestjs-grpc-identity'
import { TypeOrmSeedingModule }                from '@atls/nestjs-typeorm-seeding'
// @ts-expect-error
import { SeederFactory }                       from '@atls/nestjs-typeorm-seeding'
import { Test }                                from '@nestjs/testing'
import { jest }                                from '@jest/globals'
import { describe }                            from '@jest/globals'
import { beforeAll }                           from '@jest/globals'
import { afterAll }                            from '@jest/globals'
import { it }                                  from '@jest/globals'
import { expect }                              from '@jest/globals'
import { GenericContainer }                    from 'testcontainers'
import { Wait }                                from 'testcontainers'
import { promises as fs }                      from 'fs'
import { join }                                from 'path'
import { firstValueFrom }                      from 'rxjs'
import { v4 as uuid }                          from 'uuid'
import getPort                                 from 'get-port'

import { FilesServiceClientModule }            from '@atls/services-proto-files'
import { FILES_SERVICE_CLIENT_TOKEN }          from '@atls/services-proto-files'
import { FILES_INFRASTRUCTURE_MODULE_OPTIONS } from '@files/infrastructure-module'
import { FileAggregate }                       from '@files/infrastructure-module'
import { FILES_STORAGE_MODULE_OPTIONS }        from '@files/storage-adapter-module'
import { serverOptions }                       from '@files/grpc-adapter-module'

import { FilesServiceEntrypointModule }        from '../src/files-service-entrypoint.module.js'
import { AuthMetadataFactory }                 from './utils/index.js'

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

    const testingModule = await Test.createTestingModule({
      imports: [
        FilesServiceClientModule.register({ url: `0.0.0.0:${port}` }),
        TypeOrmSeedingModule.register(),
        FilesServiceEntrypointModule,
      ],
    })
      .overrideProvider(FILES_STORAGE_MODULE_OPTIONS)
      .useValue({
        apiEndpoint: 'http://localhost:8000',
        keyFilename: join(__dirname, 'fixtures/fake-google-credentials.json'),
      })
      .overrideProvider(FILES_INFRASTRUCTURE_MODULE_OPTIONS)
      .useValue({
        db: {
          port: postgres.getMappedPort(5432),
        },
      })
      .overrideProvider(GRPC_IDENTITY_MODULE_OPTIONS)
      .useValue({
        jwks: {
          jwksUri: join(__dirname, 'fixtures/.jwks.json'),
          fetcher: async (jwksUri: string) => {
            const data = await fs.readFile(jwksUri)

            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return JSON.parse(data.toString())
          },
          cache: true,
          jwksRequestsPerMinute: 5,
        },
      })
      .compile()

    service = testingModule.createNestMicroservice({
      ...serverOptions,
      options: {
        ...serverOptions.options,
        url: `0.0.0.0:${port}`,
      },
    })

    await service.listenAsync()

    client = testingModule.get<FilesServiceClient>(FILES_SERVICE_CLIENT_TOKEN)
    seederFactory = testingModule.get(SeederFactory as string)
  })

  afterAll(async () => {
    await service.close()
    await postgres.stop()
  })

  it('check list files id query', async () => {
    const ownerId = uuid()

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const seeds = await seederFactory.for(FileAggregate).with({ ownerId }).create(2)
    const metadata = await metadataFactory.createMetadata(ownerId)

    const { files: eqFiles } = await firstValueFrom(
      client.listFiles(
        {
          query: {
            id: {
              eq: {
                value: seeds[0].id,
              },
            },
          },
        },
        metadata
      )
    )

    const { files: inFiles } = await firstValueFrom(
      client.listFiles(
        {
          query: {
            id: {
              in: {
                values: [seeds[0].id],
              },
            },
          },
        },
        metadata
      )
    )

    expect(eqFiles[0].id).toBe(seeds[0].id)
    expect(inFiles[0].id).toBe(seeds[0].id)
    expect(eqFiles.length).toBe(inFiles.length)
  })
})
