import type { Client }                                from '@connectrpc/connect'
import type { INestMicroservice }                     from '@nestjs/common'
import type { StartedKafkaContainer }                 from '@testcontainers/kafka'
import type { StartedTestContainer }                  from 'testcontainers'

import assert                                         from 'node:assert/strict'
import { describe }                                   from 'node:test'
import { before }                                     from 'node:test'
import { after }                                      from 'node:test'
import { it }                                         from 'node:test'

import { ConnectRpcServer }                           from '@atls/nestjs-connectrpc'
import { ServerProtocol }                             from '@atls/nestjs-connectrpc'
import { ValidationError }                            from '@atls/protobuf-rpc'
import { ConnectError }                               from '@connectrpc/connect'
import { Test }                                       from '@nestjs/testing'
import { KafkaContainer }                             from '@testcontainers/kafka'
import { findLogicalError }                           from '@atls/protobuf-rpc'
import { findValidationErrorDetails }                 from '@atls/protobuf-rpc'
import { createClient }                               from '@connectrpc/connect'
import { createGrpcTransport }                        from '@connectrpc/connect-node'
import { faker }                                      from '@faker-js/faker'
import { GenericContainer }                           from 'testcontainers'
import { Wait }                                       from 'testcontainers'
import getPort                                        from 'get-port'

import { FilesEngine }                                from '@atls/files-rpc/connect'
import { FilesBucketsAdapter }                        from '@files-engine/domain-module'
import { FilesBucketSizeConditions }                  from '@files-engine/domain-module'
import { FilesBucketConditions }                      from '@files-engine/domain-module'
import { FilesBucketType }                            from '@files-engine/domain-module'
import { FilesBucket }                                from '@files-engine/domain-module'
import { StaticFilesBucketsAdapterImpl }              from '@files-engine/infrastructure-module'
import { FILES_ENGINE_INFRASTRUCTURE_MODULE_OPTIONS } from '@files-engine/infrastructure-module'

import { FilesEngineServiceEntrypointModule }         from '../src/files-engine-service-entrypoint.module.js'

describe('files-service rpc common', () => {
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
        db: {
          port: postgres.getMappedPort(5432),
        },
        events: {
          brokers: [`${kafka.getHost()}:${kafka.getMappedPort(9093)}`],
        },
      })
      .overrideProvider(FilesBucketsAdapter)
      .useValue(
        new StaticFilesBucketsAdapterImpl([
          FilesBucket.create(
            FilesBucketType.PUBLIC,
            'public',
            'public',
            '/',
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
      it('check invalid upload fields validation', async () => {
        await assert.rejects(
          async () => client.createUpload({}),
          (error) => {
            assert.ok(error instanceof ConnectError)

            const errors = findValidationErrorDetails(error)

            assert.deepEqual(errors, [
              new ValidationError({
                id: 'ownerId',
                property: 'ownerId',
                messages: [{ id: 'isUuid', constraint: 'ownerId must be a UUID' }],
              }),
              new ValidationError({
                id: 'bucket',
                property: 'bucket',
                messages: [{ id: 'isNotEmpty', constraint: 'bucket should not be empty' }],
              }),
              new ValidationError({
                id: 'name',
                property: 'name',
                messages: [{ id: 'isNotEmpty', constraint: 'name should not be empty' }],
              }),
              new ValidationError({
                id: 'size',
                property: 'size',
                messages: [{ id: 'min', constraint: 'size must not be less than 1' }],
              }),
            ])

            return true
          }
        )
      })

      it('check unknown bucket', async () => {
        await assert.rejects(
          async () =>
            client.createUpload({
              ownerId: faker.string.uuid(),
              bucket: 'unknown',
              name: faker.system.commonFileName('png'),
              size: 1,
            }),
          (error) => {
            assert.ok(error instanceof ConnectError)

            const errors = findValidationErrorDetails(error)

            assert.deepEqual(errors, [
              new ValidationError({
                id: 'guard.against.not-instance',
                property: 'bucket',
                messages: [
                  {
                    id: 'guard.against.not-instance',
                    constraint: `Guard against 'bucket' value 'undefined' not instance 'FilesBucket'.`,
                  },
                ],
              }),
            ])

            return true
          }
        )
      })

      it('check invalid file type', async () => {
        await assert.rejects(
          async () =>
            client.createUpload({
              ownerId: faker.string.uuid(),
              bucket: 'public',
              name: 'test.zip',
              size: 1,
            }),
          (error) => {
            assert.ok(error instanceof ConnectError)

            const logicalError = findLogicalError(error)

            assert.equal(
              logicalError?.message,
              `Files bucket not support type 'application/zip', only 'image/*'`
            )

            return true
          }
        )
      })

      it('check file size', async () => {
        await assert.rejects(
          async () =>
            client.createUpload({
              ownerId: faker.string.uuid(),
              name: faker.system.commonFileName('png'),
              bucket: 'public',
              size: 2000,
            }),
          (error) => {
            assert.ok(error instanceof ConnectError)

            const logicalError = findLogicalError(error)

            assert.equal(
              logicalError?.message,
              'File size must be greater than 0 and less than 1000, current size is 2000'
            )

            return true
          }
        )
      })
    })

    describe('confirm upload', () => {
      it('check invalid confirm-upload request validation', async () => {
        await assert.rejects(
          async () => client.confirmUpload({}),
          (error) => {
            assert.ok(error instanceof ConnectError)

            const errors = findValidationErrorDetails(error)

            assert.deepEqual(errors, [
              new ValidationError({
                id: 'id',
                property: 'id',
                messages: [{ id: 'isUuid', constraint: 'id must be a UUID' }],
              }),
              new ValidationError({
                id: 'ownerId',
                property: 'ownerId',
                messages: [{ id: 'isUuid', constraint: 'ownerId must be a UUID' }],
              }),
            ])

            return true
          }
        )
      })
    })
  })
})
