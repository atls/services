import type { FilesBucketType }          from '../interfaces/index.js'
import type { FilesBucketsRegistryPort } from '../ports/index.js'
import type { StoragePort }              from '../ports/index.js'

import { describe }                      from '@jest/globals'
import { expect }                        from '@jest/globals'
import { it }                            from '@jest/globals'
import { v4 as uuid }                    from 'uuid'

import { Upload }                        from './upload.aggregate.js'

describe('project aggregate', () => {
  const registry = {
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
  } as FilesBucketsRegistryPort

  const storage = {
    async generateUploadUrl(): Promise<string> {
      return Promise.resolve('http://example.com/upload')
    },
    async generateReadUrl(): Promise<string> {
      return Promise.resolve('http://example.com/upload')
    },
    async getMetadata(
      bucket,
      filename
    ): Promise<{ bucket: string; type: FilesBucketType; name: string; size: number }> {
      return Promise.resolve({
        bucket,
        type: 'public' as FilesBucketType,
        name: filename,
        size: 1000,
      })
    },
  } as StoragePort

  it('check bucket', async () => {
    expect.assertions(1)

    const upload = new Upload(registry, storage)

    try {
      await upload.create(uuid(), uuid(), 'undefined', 'test.png', 206)
    } catch (error) {
      expect((error as Error).message).toEqual('Files bucket undefined not found')
    }
  })

  it('check file content type', async () => {
    expect.assertions(1)

    const upload = new Upload(registry, storage)

    try {
      await upload.create(uuid(), uuid(), 'test', 'test.zip', 206)
    } catch (error) {
      expect((error as Error).message).toEqual(
        `Files bucket test not support type 'application/zip', only 'image/*'.`
      )
    }
  })

  it('check file size', async () => {
    expect.assertions(1)

    const upload = new Upload(registry, storage)

    try {
      await upload.create(uuid(), uuid(), 'test', 'test.png', 2000)
    } catch (error) {
      expect((error as Error).message).toEqual(
        'File size must be greater than 0 and less than 1000, current size is 2000'
      )
    }
  })

  it('create upload', async () => {
    const upload = new Upload(registry, storage)

    await upload.create(uuid(), uuid(), 'test', 'test.png', 206)

    expect(upload.getUncommittedEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'test.png',
        }),
      ])
    )
  })

  it('confirm upload', async () => {
    const upload = new Upload(registry, storage)
    const id = uuid()
    const owner = uuid()

    await upload.create(id, owner, 'test', 'test.png', 206)
    await upload.confirm(owner)

    expect(upload.getUncommittedEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          uploadId: id,
          ownerId: owner,
        }),
      ])
    )
  })

  it('check already confirmed upload', async () => {
    expect.assertions(1)

    const upload = new Upload(registry, storage)
    const owner = uuid()

    await upload.create(uuid(), owner, 'test', 'test.png', 206)
    await upload.confirm(owner)

    try {
      await upload.confirm(owner)
    } catch (error) {
      expect((error as Error).message).toEqual('Upload already confirmed.')
    }
  })

  it('check confirmed initiator', async () => {
    expect.assertions(1)

    const upload = new Upload(registry, storage)

    await upload.create(uuid(), uuid(), 'test', 'test.png', 206)

    try {
      await upload.confirm(uuid())
    } catch (error) {
      expect((error as Error).message).toEqual('Upload initiator does not match the endorsement.')
    }
  })
})
