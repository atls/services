import { describe }              from '@jest/globals'
import { afterAll }              from '@jest/globals'
import { expect }                from '@jest/globals'
import { it }                    from '@jest/globals'

import { FilesBucketsEnvConfig } from './files-application-env.config'

describe('files buckets env config', () => {
  const originalEnv = process.env

  afterAll(async () => {
    process.env = originalEnv
  })

  it('throw empty bucket', () => {
    process.env.FILES_BUCKETS_TEST = '1'

    expect(() => new FilesBucketsEnvConfig().createFilesBucketsConfigOptions()).toThrow(
      'Required option for bucket test bucket not found'
    )
  })

  it('set bucket', () => {
    process.env.FILES_BUCKETS_TEST_BUCKET = 'test'

    expect(new FilesBucketsEnvConfig().createFilesBucketsConfigOptions()).toEqual(
      expect.objectContaining({
        buckets: expect.arrayContaining([
          expect.objectContaining({
            bucket: 'test',
          }),
        ]),
      })
    )
  })

  it('set default type', () => {
    process.env.FILES_BUCKETS_TEST_BUCKET = 'test'

    expect(new FilesBucketsEnvConfig().createFilesBucketsConfigOptions()).toEqual(
      expect.objectContaining({
        buckets: expect.arrayContaining([
          expect.objectContaining({
            type: 'private',
          }),
        ]),
      })
    )
  })

  it('set type', () => {
    process.env.FILES_BUCKETS_TEST_BUCKET = 'test'
    process.env.FILES_BUCKETS_TEST_TYPE = 'public'

    expect(new FilesBucketsEnvConfig().createFilesBucketsConfigOptions()).toEqual(
      expect.objectContaining({
        buckets: expect.arrayContaining([
          expect.objectContaining({
            type: 'public',
          }),
        ]),
      })
    )
  })

  it('set default path', () => {
    process.env.FILES_BUCKETS_TEST_BUCKET = 'test'

    expect(new FilesBucketsEnvConfig().createFilesBucketsConfigOptions()).toEqual(
      expect.objectContaining({
        buckets: expect.arrayContaining([
          expect.objectContaining({
            path: '/',
          }),
        ]),
      })
    )
  })

  it('set path', () => {
    process.env.FILES_BUCKETS_TEST_BUCKET = 'test'
    process.env.FILES_BUCKETS_TEST_PATH = 'test/'

    expect(new FilesBucketsEnvConfig().createFilesBucketsConfigOptions()).toEqual(
      expect.objectContaining({
        buckets: expect.arrayContaining([
          expect.objectContaining({
            path: 'test/',
          }),
        ]),
      })
    )
  })

  it('set default expiration', () => {
    process.env.FILES_BUCKETS_TEST_BUCKET = 'test'

    expect(new FilesBucketsEnvConfig().createFilesBucketsConfigOptions()).toEqual(
      expect.objectContaining({
        buckets: expect.arrayContaining([
          expect.objectContaining({
            expiration: 1800000,
          }),
        ]),
      })
    )
  })

  it('set expiration', () => {
    process.env.FILES_BUCKETS_TEST_BUCKET = 'test'
    process.env.FILES_BUCKETS_TEST_EXPIRATION = '100'

    expect(new FilesBucketsEnvConfig().createFilesBucketsConfigOptions()).toEqual(
      expect.objectContaining({
        buckets: expect.arrayContaining([
          expect.objectContaining({
            expiration: 100,
          }),
        ]),
      })
    )
  })

  it('set default conditions type', () => {
    process.env.FILES_BUCKETS_TEST_BUCKET = 'test'

    expect(new FilesBucketsEnvConfig().createFilesBucketsConfigOptions()).toEqual(
      expect.objectContaining({
        buckets: expect.arrayContaining([
          expect.objectContaining({
            conditions: expect.objectContaining({
              type: 'image/*',
            }),
          }),
        ]),
      })
    )
  })

  it('set conditions type', () => {
    process.env.FILES_BUCKETS_TEST_BUCKET = 'test'
    process.env.FILES_BUCKETS_TEST_CONDITIONS_TYPE = 'application/json'

    expect(new FilesBucketsEnvConfig().createFilesBucketsConfigOptions()).toEqual(
      expect.objectContaining({
        buckets: expect.arrayContaining([
          expect.objectContaining({
            conditions: expect.objectContaining({
              type: 'application/json',
            }),
          }),
        ]),
      })
    )
  })

  it('set default conditions length min', () => {
    process.env.FILES_BUCKETS_TEST_BUCKET = 'test'

    expect(new FilesBucketsEnvConfig().createFilesBucketsConfigOptions()).toEqual(
      expect.objectContaining({
        buckets: expect.arrayContaining([
          expect.objectContaining({
            conditions: expect.objectContaining({
              length: expect.objectContaining({
                min: 0,
              }),
            }),
          }),
        ]),
      })
    )
  })

  it('set default conditions length min', () => {
    process.env.FILES_BUCKETS_TEST_BUCKET = 'test'
    process.env.FILES_BUCKETS_TEST_CONDITIONS_LENGTH_MIN = '10'

    expect(new FilesBucketsEnvConfig().createFilesBucketsConfigOptions()).toEqual(
      expect.objectContaining({
        buckets: expect.arrayContaining([
          expect.objectContaining({
            conditions: expect.objectContaining({
              length: expect.objectContaining({
                min: 10,
              }),
            }),
          }),
        ]),
      })
    )
  })

  it('set default conditions length max', () => {
    process.env.FILES_BUCKETS_TEST_BUCKET = 'test'

    expect(new FilesBucketsEnvConfig().createFilesBucketsConfigOptions()).toEqual(
      expect.objectContaining({
        buckets: expect.arrayContaining([
          expect.objectContaining({
            conditions: expect.objectContaining({
              length: expect.objectContaining({
                max: 1000000,
              }),
            }),
          }),
        ]),
      })
    )
  })

  it('set conditions length max', () => {
    process.env.FILES_BUCKETS_TEST_BUCKET = 'test'
    process.env.FILES_BUCKETS_TEST_CONDITIONS_LENGTH_MAX = '10'

    expect(new FilesBucketsEnvConfig().createFilesBucketsConfigOptions()).toEqual(
      expect.objectContaining({
        buckets: expect.arrayContaining([
          expect.objectContaining({
            conditions: expect.objectContaining({
              length: expect.objectContaining({
                max: 10,
              }),
            }),
          }),
        ]),
      })
    )
  })

  it('set path', () => {
    process.env.FILES_BUCKETS_TEST_BUCKET = 'test'
    process.env.FILES_BUCKETS_TEST_HOSTNAME = 'http://localhost:3000'

    expect(new FilesBucketsEnvConfig().createFilesBucketsConfigOptions()).toEqual(
      expect.objectContaining({
        buckets: expect.arrayContaining([
          expect.objectContaining({
            hostname: 'http://localhost:3000',
          }),
        ]),
      })
    )
  })
})
