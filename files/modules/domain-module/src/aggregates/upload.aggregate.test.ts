import { Test }                 from '@nestjs/testing'
import { CommandGateway }       from '@typa/common'
import { TypaModule }           from '@typa/common'
import { v4 as uuid }           from 'uuid'

import { FilesBucketType }      from '../interfaces'
import { CreateUploadCommand }  from '../commands'
import { ConfirmUploadCommand } from '../commands'
import { Upload }               from './upload.aggregate'

describe('upload aggregate', () => {
  let gateway: CommandGateway

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [TypaModule.register()],
      providers: [
        {
          provide: Upload,
          useValue: new Upload(
            {
              get(name) {
                if (name === 'undefined') {
                  return undefined
                }

                return {
                  name,
                  type: 'public' as FilesBucketType,
                  bucket: 'test',
                  expiration: 1000,
                  path: '/',
                  conditions: {
                    type: 'image/*',
                    length: {
                      min: 0,
                      max: 1000,
                    },
                  },
                }
              },
            },
            {
              generateUploadUrl() {
                return Promise.resolve('http://example.com/upload')
              },
              generateReadUrl() {
                return Promise.resolve('http://example.com/upload')
              },
              getMetadata(bucket, filename) {
                return Promise.resolve({
                  bucket,
                  type: 'public' as FilesBucketType,
                  name: filename,
                  size: 1000,
                })
              },
            }
          ),
        },
      ],
    }).compile()

    await module.createNestApplication().init()

    gateway = module.get<CommandGateway>(CommandGateway)
  })

  afterAll(async () => {})

  it('check bucket', async () => {
    expect.assertions(1)

    try {
      await gateway
        .send(new CreateUploadCommand(uuid(), uuid(), 'undefined', 'test.png', 206))
        .toPromise()
    } catch (error) {
      expect(error.message).toEqual('Files bucket undefined not found')
    }
  })

  it('check file content type', async () => {
    expect.assertions(1)

    try {
      await gateway
        .send(new CreateUploadCommand(uuid(), uuid(), 'test', 'test.zip', 206))
        .toPromise()
    } catch (error) {
      expect(error.message).toEqual(
        `Files bucket test not support type 'application/zip', only 'image/*'.`
      )
    }
  })

  it('check file size', async () => {
    expect.assertions(1)

    try {
      await gateway
        .send(new CreateUploadCommand(uuid(), uuid(), 'test', 'test.png', 2000))
        .toPromise()
    } catch (error) {
      expect(error.message).toEqual(
        'File size must be greater than 0 and less than 1000, current size is 2000'
      )
    }
  })

  it('create upload', async () => {
    const id = uuid()

    const result = await gateway
      .send(new CreateUploadCommand(id, uuid(), 'test', 'test.png', 206))
      .toPromise()

    expect(result.id).toBe(id)
  })

  it('confirm upload', async () => {
    const id = uuid()
    const owner = uuid()

    const result = await gateway
      .send(new CreateUploadCommand(id, owner, 'test', 'test.png', 206))
      .toPromise()

    expect(result.id).toBe(id)

    const confirmResult = await gateway.send(new ConfirmUploadCommand(id, owner)).toPromise()

    expect(result).toEqual(confirmResult)
  })

  it('check already confirmed upload', async () => {
    expect.assertions(1)

    const owner = uuid()

    const result = await gateway
      .send(new CreateUploadCommand(uuid(), owner, 'test', 'test.png', 206))
      .toPromise()

    await gateway.send(new ConfirmUploadCommand(result.id, owner)).toPromise()

    try {
      await gateway.send(new ConfirmUploadCommand(result.id, owner)).toPromise()
    } catch (error) {
      expect(error.message).toEqual('Upload already confirmed.')
    }
  })

  it('check confirmed initiator', async () => {
    expect.assertions(1)

    const result = await gateway
      .send(new CreateUploadCommand(uuid(), uuid(), 'test', 'test.png', 206))
      .toPromise()

    try {
      await gateway.send(new ConfirmUploadCommand(result.id, uuid())).toPromise()
    } catch (error) {
      expect(error.message).toEqual('Upload initiator does not match the endorsement.')
    }
  })
})
