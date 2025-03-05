import type { ConfirmUploadResponse }      from '@atls/services-proto-files'
import type { ListFilesResponse }          from '@atls/services-proto-files'
import type { FilesServiceClient }         from '@atls/services-proto-files'
import type { CreateUploadResponse }       from '@atls/services-proto-files'
import type { StorageFileMetadata }        from '@files/domain-module'
import type { DatabaseOptions }            from '@files/mikro-orm-adapter'
import type { INestMicroservice }          from '@nestjs/common'
import type { TestingModule }              from '@nestjs/testing'
import type { StartedTestContainer }       from 'testcontainers'

import type { GcsServerStartedContainer }  from './containers/index.js'
import type { FilesService }               from './service-entrypoint.interfaces.js'
import type { TestCase }                   from './service-entrypoint.interfaces.js'

import assert                              from 'node:assert/strict'
import { createReadStream }                from 'node:fs'
import { describe }                        from 'node:test'
import { before }                          from 'node:test'
import { after }                           from 'node:test'
import { it }                              from 'node:test'

import { Test }                            from '@nestjs/testing'
import { GenericContainer }                from 'testcontainers'
import { Wait }                            from 'testcontainers'
import { join }                            from 'path'
import { firstValueFrom }                  from 'rxjs'
import { v4 as uuid }                      from 'uuid'
import getPort                             from 'get-port'
import fetch                               from 'node-fetch'

import { FilesServiceClientModule }        from '@atls/services-proto-files'
import { FILES_SERVICE_CLIENT_TOKEN }      from '@atls/services-proto-files'
import { ApplicationModule }               from '@files/application-module'
import { FILES_BUCKETS_MODULE_OPTIONS }    from '@files/buckets-config-adapter'
import { FilesBucketsConfigAdapterModule } from '@files/buckets-config-adapter'
import { ConfigAdapterModule }             from '@files/config-adapter'
import { ConfigModule }                    from '@files/config-adapter'
import { ConfigService }                   from '@files/config-adapter'
import { CqrsAdapterModule }               from '@files/cqrs-adapter'
import { GRPC_IDENTITY_MODULE_OPTIONS }    from '@files/grpc-adapter'
import { GrpcAdapterModule }               from '@files/grpc-adapter'
import { InfrastructureModule }            from '@files/infrastructure-module'
import { MikroOrmAdapterModule }           from '@files/mikro-orm-adapter'
import { FILES_STORAGE_MODULE_OPTIONS }    from '@files/storage-adapter'
import { FilesStorageAdapterModule }       from '@files/storage-adapter'
import { serverOptions }                   from '@files/grpc-adapter'

import * as configs                        from '../src/configs/index.js'
import { GcsServerContainer }              from './containers/index.js'
import { AuthMetadataFactory }             from './utils/index.js'
import { databaseConfig }                  from '../src/configs/index.js'
import { dirname }                         from './service-entrypoint.constants.js'
import { uploadRequest }                   from './service-entrypoint.constants.js'
import { pager }                           from './service-entrypoint.constants.js'
import { createBuckets }                   from './service-entrypoint.constants.js'
import { grpcIdentityOptions }             from './service-entrypoint.constants.js'

describe('Files ServiceEntrypointModule', () => {
  let postgres: StartedTestContainer
  let gcsServer: GcsServerStartedContainer
  let service: INestMicroservice
  let filesServiceClient: FilesServiceClient
  let filesService: FilesService
  let testingModule: TestingModule
  let databaseOptions: DatabaseOptions

  const metadataFactory = new AuthMetadataFactory(
    join(dirname, '../../../../.config/dev/.jwks.pem')
  )

  let upload: CreateUploadResponse
  let file: ConfirmUploadResponse

  before(async () => {
    databaseOptions = databaseConfig()

    postgres = await new GenericContainer('bitnami/postgresql')
      .withWaitStrategy(Wait.forLogMessage('database system is ready to accept connections'))
      .withEnvironment({
        POSTGRESQL_HOST: String(databaseOptions.host),
        POSTGRESQL_DATABASE: String(databaseOptions.dbName),
        POSTGRESQL_USER: String(databaseOptions.user),
        POSTGRESQL_PASSWORD: String(databaseOptions.password),
      })
      .withExposedPorts(Number(databaseOptions.port))
      .start()

    gcsServer = await new GcsServerContainer('fsouza/fake-gcs-server').start()

    const port = await getPort()

    testingModule = await Test.createTestingModule({
      imports: [
        ConfigAdapterModule.register({ load: Object.values(configs) }),
        CqrsAdapterModule.register(),
        GrpcAdapterModule.register(),
        FilesStorageAdapterModule.register(),
        FilesBucketsConfigAdapterModule.register(),
        MikroOrmAdapterModule.register({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            port: postgres.getMappedPort(Number(databaseOptions.port)),
            host: configService.get('database.host'),
            dbName: configService.get('database.dbName'),
            user: configService.get('database.user'),
            password: configService.get('database.password'),
            debug: false,
            allowGlobalContext: true,
          }),
          inject: [ConfigService],
        }),
        InfrastructureModule.register(),
        ApplicationModule.register(),
        FilesServiceClientModule.register({ url: `0.0.0.0:${port}` }),
      ],
    })
      .overrideProvider(FILES_STORAGE_MODULE_OPTIONS)
      .useValue({
        apiEndpoint: gcsServer.getApiEndpoint(),
        projectId: 'dev',
        keyFilename: join(dirname, '../../../../.config/dev/fake-google-credentials.json'),
      })
      .overrideProvider(GRPC_IDENTITY_MODULE_OPTIONS)
      .useValue(grpcIdentityOptions)
      .overrideProvider(FILES_BUCKETS_MODULE_OPTIONS)
      .useValue({ buckets: createBuckets(gcsServer.getApiEndpoint()) })
      .compile()

    service = testingModule.createNestMicroservice({
      ...serverOptions,
      options: {
        ...serverOptions.options,
        url: `0.0.0.0:${port}`,
      },
    })

    await service.listen()

    filesServiceClient = testingModule.get<FilesServiceClient>(FILES_SERVICE_CLIENT_TOKEN)

    const metadata = await metadataFactory.createMetadata(uuid())

    filesService = {
      listFiles: async (request): Promise<ListFilesResponse> =>
        firstValueFrom(filesServiceClient.listFiles(request, metadata)),
      createUpload: async (request): Promise<CreateUploadResponse> =>
        firstValueFrom(filesServiceClient.createUpload(request, metadata)),
      confirmUpload: async (request): Promise<ConfirmUploadResponse> =>
        firstValueFrom(filesServiceClient.confirmUpload(request, metadata)),
    }
  })

  after(async () => {
    await service.close()
    await postgres.stop()
    await gcsServer.stop()
  })

  it('should return an empty files array', async () => {
    const { files } = await filesService.listFiles({ pager })

    assert.ok(Array.isArray(files), 'Files should be an array')
    assert.equal(files.length, 0, 'Files array should be empty')
  })

  it('should throw internal server error on invalid payloads', async () => {
    const testCases: Array<TestCase> = [
      {
        name: 'missing file name',
        request: filesService.createUpload({ ...uploadRequest, name: '' }),
      },
      {
        name: 'unsupported bucket file type',
        request: filesService.createUpload({ ...uploadRequest, name: 'test.zip' }),
        exception: `Files bucket public not support type 'application/zip', only 'image/*'`,
      },
      {
        name: 'missing bucket name',
        request: filesService.createUpload({ ...uploadRequest, bucket: '' }),
      },
      {
        name: 'unknown bucket name',
        request: filesService.createUpload({ ...uploadRequest, bucket: 'unknown' }),
        exception: 'Files bucket unknown not found',
      },
      {
        name: 'file size less than 1 byte',
        request: filesService.createUpload({ ...uploadRequest, size: 0 }),
      },
      {
        name: 'file size exceeds the maximum limit',
        request: filesService.createUpload({ ...uploadRequest, size: 2000 }),
        exception: 'File size must be greater than 0 and less than 1000, current size is 2000',
      },
      {
        name: 'missing file ID in confirm',
        request: filesService.confirmUpload({ id: '' }),
      },
      {
        name: 'unknown file ID in confirm',
        request: filesService.confirmUpload({ id: '184edd3b-e902-433d-84df-33947653b0ae' }),
        exception: 'Error on finding Upload',
      },
    ]

    await Promise.all(
      testCases.map(async ({ name, request, exception }) => {
        await assert.rejects(
          request,
          (error) => {
            assert.ok(error instanceof Error, 'Error should be an instance of Error')
            assert.ok(
              error.message.includes(exception || 'Internal server error'),
              `Error message should include ${exception || 'Internal server error'}, case: ${name}`
            )
            return true
          },
          `Case '${name}' should throw error`
        )
      })
    )
  })

  it('should successfully create a new upload', async () => {
    const createdUpload = await filesService.createUpload(uploadRequest)

    assert.ok(createdUpload, 'Upload should be successfully created')
    assert.ok(createdUpload.id, 'Upload ID should be present')
    assert.ok(createdUpload.url, 'Upload should have an URL')

    upload = createdUpload
  })

  it('should throw an error: File not uploaded', async () => {
    await assert.rejects(
      async () => filesService.confirmUpload({ id: upload.id }),
      (error) => {
        assert.ok(error instanceof Error, 'Error should be an instance of Error')
        assert.ok(
          error.message.includes('File not uploaded'),
          `Expected error message to contain: 'File not uploaded`
        )
        return true
      }
    )
  })

  it('should confirm an existing upload', async () => {
    const response = await fetch(
      upload.url.replace('http://0.0.0.0:4443', gcsServer.getApiEndpoint()),
      {
        method: 'POST',
        body: createReadStream(join(dirname, 'fixtures/test.png')),
      }
    )

    const storageData = (await response.json()) as StorageFileMetadata

    assert.equal(response.status, 200, 'Response status should be 200')

    const confirmedUpload = await filesService.confirmUpload({ id: upload.id })

    assert.ok(confirmedUpload, 'Upload should be confirmed successfully')
    assert.ok(confirmedUpload.id, 'Confirmed upload should have an ID')
    assert.ok(confirmedUpload.url, 'Confirmed upload should have an URL')
    assert.ok(
      confirmedUpload.url.includes(storageData.name),
      'Confirmed upload URL should include the stored file name'
    )

    file = confirmedUpload
  })

  it('should throw an error: Upload already confirmed', async () => {
    await assert.rejects(
      async () => filesService.confirmUpload({ id: upload.id }),
      (error) => {
        assert.ok(error instanceof Error, 'Error should be an instance of Error')
        assert.ok(
          error.message.includes('Upload already confirmed'),
          `Expected error message to contain: 'Upload already confirmed'`
        )
        return true
      }
    )
  })

  it('should throw error: Upload initiator does not match the endorsement', async () => {
    const createdUpload = await filesService.createUpload(uploadRequest)

    assert.ok(createdUpload, 'Upload should be created')

    const response = await fetch(
      createdUpload.url.replace('http://0.0.0.0:4443', gcsServer.getApiEndpoint()),
      {
        method: 'POST',
        body: createReadStream(join(dirname, 'fixtures/test.png')),
      }
    )

    assert.equal(response.status, 200, 'Response status should be 200')

    const newMetadata = await metadataFactory.createMetadata(uuid())

    await assert.rejects(
      async () =>
        firstValueFrom(filesServiceClient.confirmUpload({ id: createdUpload.id }, newMetadata)),
      (error) => {
        assert.ok(error instanceof Error, 'Error should be an instance of Error')
        assert.ok(
          error.message.includes('Upload initiator does not match the endorsement'),
          `Expected error message to contain: 'Upload initiator does not match the endorsement`
        )
        return true
      }
    )
  })

  it('retrieves files array contained uploaded files', async () => {
    const { files } = await filesService.listFiles({ pager })

    assert.ok(Array.isArray(files), 'Files should be an array')
    assert.equal(files.length, 1, 'Files array should contain one file')
    assert.ok(
      files.some((item) => item.id === file.id),
      'Files array should include the uploaded file'
    )
  })
})
