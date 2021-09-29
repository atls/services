import { ErrorStatus }                  from '@atls/grpc-error-status'
import { GRPC_IDENTITY_MODULE_OPTIONS } from '@atls/nestjs-grpc-identity'
import { GenericContainer }             from 'testcontainers'
import { StartedTestContainer }         from 'testcontainers'
import { Wait }                         from 'testcontainers'
import { INestMicroservice }            from '@nestjs/common'
import { Test }                         from '@nestjs/testing'
import { TYPA_MODULE_OPTIONS }          from '@typa/common'
import { StorageType }                  from '@typa/common'
import fetch                            from 'node-fetch'
import getPort                          from 'get-port'
import { sign }                         from 'jsonwebtoken'
import { v4 as uuid }                   from 'uuid'
import { Metadata }                     from 'grpc'
import { promises as fs }               from 'fs'
import { join }                         from 'path'
import { createReadStream }             from 'fs'

import { UploadServiceClientModule }    from '@atls/services-proto-files'
import { UPLOAD_SERVICE_CLIENT_TOKEN }  from '@atls/services-proto-files'
import { UploadServiceClient }          from '@atls/services-proto-files'
import { serverOptions }                from '@atls/services-proto-files'
import { FILES_BUCKETS_MODULE_OPTIONS } from '@files/buckets-config-adapter-module'
import { FILES_STORAGE_MODULE_OPTIONS } from '@files/storage-adapter-module'

import { GcsServerStartedContainer }    from './containers'
import { GcsServerContainer }           from './containers'
import { FilesServiceModule }           from '../src/files-service.module'

jest.setTimeout(60000)

describe('files upload grpc adapter', () => {
  let postgres: StartedTestContainer
  let gcsServer: GcsServerStartedContainer
  let service: INestMicroservice
  let client: UploadServiceClient
  const metadata: Metadata = new Metadata()

  beforeAll(async () => {
    postgres = await new GenericContainer('bitnami/postgresql')
      .withWaitStrategy(Wait.forLogMessage('database system is ready to accept connections'))
      .withEnv('POSTGRESQL_PASSWORD', 'password')
      .withEnv('POSTGRESQL_DATABASE', 'db')
      .withExposedPorts(5432)
      .start()

    gcsServer = await new GcsServerContainer('fsouza/fake-gcs-server')
      .withCopyContentToContainer('bucket mock', '/data/test/mock.txt')
      .withExposedPorts(4443)
      .start()

    const port = await getPort()

    const module = await Test.createTestingModule({
      imports: [UploadServiceClientModule.register({ url: `0.0.0.0:${port}` }), FilesServiceModule],
    })
      .overrideProvider(FILES_STORAGE_MODULE_OPTIONS)
      .useValue({
        apiEndpoint: gcsServer.getApiEndpoint(),
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
      .overrideProvider(FILES_BUCKETS_MODULE_OPTIONS)
      .useValue({
        buckets: [
          {
            name: 'public',
            type: 'public',
            bucket: 'test',
            path: '/',
            conditions: {
              type: 'image/*',
              length: {
                min: 0,
                max: 1000,
              },
            },
          },
        ],
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

    client = module.get<UploadServiceClient>(UPLOAD_SERVICE_CLIENT_TOKEN)

    const privateKey = await fs.readFile(join(__dirname, 'fixtures/.jwks.pem'), 'utf-8')
    const token = sign({ sub: uuid() }, privateKey, { algorithm: 'RS256' })

    metadata.add('authorization', `Bearer ${token}`)
  })

  afterAll(async () => {
    await service.close()
    await postgres.stop()
    await gcsServer.stop()
  })

  it('validate create upload upload request', async () => {
    expect.assertions(1)

    try {
      await client
        .createUpload(
          {
            bucket: '',
            name: '',
            size: 0,
          },
          metadata
        )
        .toPromise()
    } catch (error) {
      expect(ErrorStatus.fromServiceError(error).toObject()).toEqual(
        expect.objectContaining({
          details: expect.arrayContaining([
            expect.objectContaining({
              '@type': 'type.googleapis.com/google.rpc.BadRequest',
              fieldViolationsList: expect.arrayContaining([
                expect.objectContaining({
                  field: 'bucket',
                  description: 'bucket should not be empty',
                }),
                expect.objectContaining({
                  field: 'name',
                  description: 'name should not be empty',
                }),
                expect.objectContaining({
                  field: 'size',
                  description: 'size must not be less than 1',
                }),
              ]),
            }),
          ]),
        })
      )
    }
  })

  it('check bucket', async () => {
    expect.assertions(1)

    try {
      await client
        .createUpload(
          {
            bucket: 'uknown',
            name: 'test.png',
            size: 1,
          },
          metadata
        )
        .toPromise()
    } catch (error) {
      expect(ErrorStatus.fromServiceError(error)).toEqual(
        expect.objectContaining({
          code: 3,
          message: 'Files bucket uknown not found',
        })
      )
    }
  })

  it('check file type', async () => {
    expect.assertions(1)

    try {
      await client
        .createUpload(
          {
            bucket: 'public',
            name: 'test.zip',
            size: 1,
          },
          metadata
        )
        .toPromise()
    } catch (error) {
      expect(ErrorStatus.fromServiceError(error)).toEqual(
        expect.objectContaining({
          code: 3,
          message: `Files bucket public not support type 'application/zip', only 'image/*'.`,
        })
      )
    }
  })

  it('check file size', async () => {
    expect.assertions(1)

    try {
      await client
        .createUpload(
          {
            bucket: 'public',
            name: 'test.png',
            size: 2000,
          },
          metadata
        )
        .toPromise()
    } catch (error) {
      expect(ErrorStatus.fromServiceError(error)).toEqual(
        expect.objectContaining({
          code: 3,
          message: 'File size must be greater than 0 and less than 1000, current size is 2000',
        })
      )
    }
  })

  it('create upload', async () => {
    const upload = await client
      .createUpload(
        {
          bucket: 'public',
          name: 'test.png',
          size: 206,
        },
        metadata
      )
      .toPromise()

    expect(upload.url).toBeDefined()
  })

  it('check confirm unknown upload', async () => {
    expect.assertions(1)

    try {
      await client
        .confirmUpload(
          {
            id: '184edd3b-e902-433d-84df-33947653b0ae',
          },
          metadata
        )
        .toPromise()
    } catch (error) {
      expect(ErrorStatus.fromServiceError(error)).toEqual(
        expect.objectContaining({
          code: 3,
          message: 'Upload not found.',
        })
      )
    }
  })

  it('check files uploaded', async () => {
    expect.assertions(1)

    const upload = await client
      .createUpload(
        {
          bucket: 'public',
          name: 'test.png',
          size: 206,
        },
        metadata
      )
      .toPromise()

    try {
      await client
        .confirmUpload(
          {
            id: upload.id,
          },
          metadata
        )
        .toPromise()
    } catch (error) {
      expect(ErrorStatus.fromServiceError(error)).toEqual(
        expect.objectContaining({
          code: 3,
          message: 'File not uploaded.',
        })
      )
    }
  })

  it('create and confirm upload', async () => {
    const upload = await client
      .createUpload(
        {
          bucket: 'public',
          name: 'test.png',
          size: 206,
        },
        metadata
      )
      .toPromise()

    const response = await fetch(upload.url, {
      method: 'POST',
      body: createReadStream(join(__dirname, 'fixtures/test.png')),
    })

    const storageData = await response.json()

    expect(response.status).toBe(200)

    const confirmed = await client
      .confirmUpload(
        {
          id: upload.id,
        },
        metadata
      )
      .toPromise()

    expect(confirmed.url).toContain(storageData.name)
  })

  it('check confirm already confirmed upload', async () => {
    expect.assertions(1)

    const upload = await client
      .createUpload(
        {
          bucket: 'public',
          name: 'confirmed.png',
          size: 206,
        },
        metadata
      )
      .toPromise()

    await fetch(upload.url, {
      method: 'POST',
      body: createReadStream(join(__dirname, 'fixtures/test.png')),
    })

    await client
      .confirmUpload(
        {
          id: upload.id,
        },
        metadata
      )
      .toPromise()

    try {
      await client
        .confirmUpload(
          {
            id: upload.id,
          },
          metadata
        )
        .toPromise()
    } catch (error) {
      expect(ErrorStatus.fromServiceError(error)).toEqual(
        expect.objectContaining({
          code: 3,
          message: 'Upload already confirmed.',
        })
      )
    }
  })

  it('check confirm upload by another user', async () => {
    expect.assertions(1)

    const upload = await client
      .createUpload(
        {
          bucket: 'public',
          name: 'confirmed.png',
          size: 206,
        },
        metadata
      )
      .toPromise()

    await fetch(upload.url, {
      method: 'POST',
      body: createReadStream(join(__dirname, 'fixtures/test.png')),
    })

    const privateKey = await fs.readFile(join(__dirname, 'fixtures/.jwks.pem'), 'utf-8')
    const token = sign({ sub: uuid() }, privateKey, { algorithm: 'RS256' })

    const meta = new Metadata()

    meta.add('authorization', `Bearer ${token}`)

    try {
      await client
        .confirmUpload(
          {
            id: upload.id,
          },
          meta
        )
        .toPromise()
    } catch (error) {
      expect(ErrorStatus.fromServiceError(error)).toEqual(
        expect.objectContaining({
          code: 3,
          message: 'Upload initiator does not match the endorsement.',
        })
      )
    }
  })
})
