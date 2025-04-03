import type { Client }                                from '@connectrpc/connect'
import type { INestMicroservice }                     from '@nestjs/common'
import type { StartedKafkaContainer }                 from '@testcontainers/kafka'
import type { StartedTestContainer }                  from 'testcontainers'

import assert                                         from 'node:assert/strict'
import { createReadStream }                           from 'node:fs'
import { join }                                       from 'node:path'
import { describe }                                   from 'node:test'
import { before }                                     from 'node:test'
import { after }                                      from 'node:test'
import { it }                                         from 'node:test'
import { fileURLToPath }                              from 'node:url'

import { ConnectRpcServer }                           from '@atls/nestjs-connectrpc'
import { ServerProtocol }                             from '@atls/nestjs-connectrpc'
import { ConnectError }                               from '@connectrpc/connect'
import { Test }                                       from '@nestjs/testing'
import { KafkaContainer }                             from '@testcontainers/kafka'
import { findLogicalError }                           from '@atls/protobuf-rpc'
import { createClient }                               from '@connectrpc/connect'
import { createGrpcTransport }                        from '@connectrpc/connect-node'
import { faker }                                      from '@faker-js/faker'
import { GenericContainer }                           from 'testcontainers'
import { Wait }                                       from 'testcontainers'
import getPort                                        from 'get-port'
import fetch                                          from 'node-fetch'

import { FilesEngine }                                from '@atls/files-rpc/connect'
import { FilesBucketsAdapter }                        from '@files-engine/domain-module'
import { FilesBucketSizeConditions }                  from '@files-engine/domain-module'
import { FilesBucketConditions }                      from '@files-engine/domain-module'
import { FilesBucketType }                            from '@files-engine/domain-module'
import { FilesBucket }                                from '@files-engine/domain-module'
import { StaticFilesBucketsAdapterImpl }              from '@files-engine/infrastructure-module'
import { FILES_ENGINE_INFRASTRUCTURE_MODULE_OPTIONS } from '@files-engine/infrastructure-module'

import { FilesEngineServiceEntrypointModule }         from '../src/files-engine-service-entrypoint.module.js'

describe('files-service rpc s3', () => {
  let postgres: StartedTestContainer
  let kafka: StartedKafkaContainer
  let service: INestMicroservice
  let storage: StartedTestContainer
  let client: Client<typeof FilesEngine>

  before(async () => {
    kafka = await new KafkaContainer().withExposedPorts(9093).start()

    postgres = await new GenericContainer('bitnami/postgresql')
      .withWaitStrategy(Wait.forLogMessage('database system is ready to accept connections'))
      .withEnvironment({
        POSTGRESQL_PASSWORD: 'password',
        POSTGRESQL_DATABASE: 'db',
      })
      .withExposedPorts(5432)
      .start()

    storage = await new GenericContainer('minio/minio')
      .withCopyContentToContainer([
        {
          content: '1',
          target: '/data/public/mock.txt',
        },
      ])
      .withWaitStrategy(Wait.forLogMessage('http://127.0.0.1:9000'))
      .withEnvironment({
        MINIO_ROOT_USER: 'accesskey',
        MINIO_ROOT_PASSWORD: 'secretkey',
        MINIO_DOMAIN: 'localhost',
      })
      .withCommand(['server', '/data'])
      .withExposedPorts(9000)
      .start()

    const port = await getPort()

    const testingModule = await Test.createTestingModule({
      imports: [FilesEngineServiceEntrypointModule],
    })
      .overrideProvider(FILES_ENGINE_INFRASTRUCTURE_MODULE_OPTIONS)
      .useValue({
        storage: 's3',
        db: {
          port: postgres.getMappedPort(5432),
        },
        events: {
          brokers: [`${kafka.getHost()}:${kafka.getMappedPort(9093)}`],
        },
        s3: {
          endpoint: `http://localhost:${storage.getMappedPort(9000)}`,
          region: 'eu-central-1',
          credentials: {
            accessKeyId: 'accesskey',
            secretAccessKey: 'secretkey',
          },
        },
      })
      .overrideProvider(FilesBucketsAdapter)
      .useValue(
        new StaticFilesBucketsAdapterImpl([
          FilesBucket.create(
            FilesBucketType.PUBLIC,
            'public',
            'public',
            '/scope',
            FilesBucketConditions.create('image/*', FilesBucketSizeConditions.create(0, 1000))
          ),
        ])
      )
      .compile()

    service = testingModule.createNestMicroservice({
      strategy: new ConnectRpcServer({
        protocol: ServerProtocol.HTTP2_INSECURE,
        port,
      }),
    })

    await service.listen()

    client = createClient(
      FilesEngine,
      createGrpcTransport({
        httpVersion: '2',
        baseUrl: `http://localhost:${port}`,
        idleConnectionTimeoutMs: 1000,
      })
    )
  })

  after(async () => {
    await service.close()
    await postgres.stop()
    await storage.stop()
    await kafka.stop()
  })

  describe('uploads', () => {
    describe('create upload', () => {
      it('check create upload', async () => {
        const { result: upload } = await client.createUpload({
          ownerId: faker.string.uuid(),
          name: faker.system.commonFileName('png'),
          bucket: 'public',
          size: 206,
        })

        assert.ok(upload?.url)
      })
    })

    describe('upload', () => {
      it('check upload file', async () => {
        const { result: upload } = await client.createUpload({
          ownerId: faker.string.uuid(),
          name: faker.system.commonFileName('png'),
          bucket: 'public',
          size: 206,
        })

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const response = await fetch(upload!.url, {
          body: createReadStream(
            join(fileURLToPath(new URL('.', import.meta.url)), 'fixtures/test.png')
          ),
          method: 'PUT',
          headers: {
            'Content-Length': '206',
            'Content-Type': 'image/png',
          },
        })

        assert.equal(response.status, 200)
      })
    })

    describe('confirm', () => {
      it('check validate not uploaded file', async () => {
        const { result: upload } = await client.createUpload({
          ownerId: faker.string.uuid(),
          name: faker.system.commonFileName('png'),
          bucket: 'public',
          size: 206,
        })

        await assert.rejects(
          async () =>
            client.confirmUpload({
              id: upload?.id,
              ownerId: upload?.ownerId,
            }),
          (error) => {
            assert.ok(error instanceof ConnectError)

            const logicalError = findLogicalError(error)

            assert.equal(logicalError?.message, 'File not uploaded')

            return true
          }
        )
      })

      it('check confirm upload', async () => {
        const { result: upload } = await client.createUpload({
          ownerId: faker.string.uuid(),
          name: faker.system.commonFileName('png'),
          bucket: 'public',
          size: 206,
        })

        assert.ok(upload)

        await fetch(upload.url, {
          body: createReadStream(
            join(fileURLToPath(new URL('.', import.meta.url)), 'fixtures/test.png')
          ),
          method: 'PUT',
          headers: {
            'Content-Length': '206',
            'Content-Type': 'image/png',
          },
        })

        await client.confirmUpload({
          id: upload?.id,
          ownerId: upload?.ownerId,
        })
      })

      it('check confirm already confirmed upload', async () => {
        const { result: upload } = await client.createUpload({
          ownerId: faker.string.uuid(),
          name: faker.system.commonFileName('png'),
          bucket: 'public',
          size: 206,
        })

        assert.ok(upload)

        await fetch(upload.url, {
          body: createReadStream(
            join(fileURLToPath(new URL('.', import.meta.url)), 'fixtures/test.png')
          ),
          method: 'PUT',
          headers: {
            'Content-Length': '206',
            'Content-Type': 'image/png',
          },
        })

        await client.confirmUpload({
          id: upload?.id,
          ownerId: upload?.ownerId,
        })

        await assert.rejects(
          async () =>
            client.confirmUpload({
              id: upload?.id,
              ownerId: upload?.ownerId,
            }),
          (error) => {
            assert.ok(error instanceof ConnectError)

            const logicalError = findLogicalError(error)

            assert.equal(logicalError?.message, 'Upload already confirmed')

            return true
          }
        )
      })
    })
  })
})
