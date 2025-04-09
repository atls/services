import assert                          from 'node:assert/strict'
import { describe }                    from 'node:test'
import { it }                          from 'node:test'

import { faker }                       from '@faker-js/faker'

import { FilesBucketType }             from '../enums/index.js'
import { UploadAlreadyConfirmedError } from '../errors/index.js'
import { UploadInitiatorDoesNotMatch } from '../errors/index.js'
import { UploadNotReadyError }         from '../errors/index.js'
import { UnknownFileTypeError }        from '../errors/index.js'
import { InvalidContentTypeError }     from '../errors/index.js'
import { InvalidContentSizeError }     from '../errors/index.js'
import { FileNotUploadedError }        from '../errors/index.js'
import { UploadConfirmedEvent }        from '../events/index.js'
import { UploadPreparedEvent }         from '../events/index.js'
import { UploadCreatedEvent }          from '../events/upload-created.event.js'
import { StorageFileMetadata }         from '../value-objects/index.js'
import { FilesBucketSizeConditions }   from '../value-objects/index.js'
import { FilesBucketConditions }       from '../value-objects/index.js'
import { FilesBucket }                 from '../value-objects/index.js'
import { Upload }                      from './upload.aggregate.js'
import { assertContains }              from '../utils/index.js'

describe('files-engine domain aggregates upload', () => {
  const fakeBucket = FilesBucket.create(
    FilesBucketType.PUBLIC,
    faker.word.sample(),
    faker.word.sample(),
    faker.system.directoryPath(),
    FilesBucketConditions.create('image/*', FilesBucketSizeConditions.create(0, 100))
  )

  const fakeMetadata = StorageFileMetadata.create(faker.image.url(), 206, 'image/png')

  describe('create', () => {
    it('check unknown file type', async () => {
      assert.throws(() => {
        new Upload().create(
          faker.string.uuid(),
          faker.string.uuid(),
          fakeBucket,
          faker.system.commonFileName('unknown'),
          faker.number.int()
        )
      }, UnknownFileTypeError)
    })

    it('check unknown content type', async () => {
      assert.throws(() => {
        new Upload().create(
          faker.string.uuid(),
          faker.string.uuid(),
          fakeBucket,
          faker.system.commonFileName('xls'),
          faker.number.int()
        )
      }, InvalidContentTypeError)
    })

    it('check unknown content size', async () => {
      assert.throws(() => {
        new Upload().create(
          faker.string.uuid(),
          faker.string.uuid(),
          fakeBucket,
          faker.system.commonFileName('png'),
          faker.number.int({ min: 200 })
        )
      }, InvalidContentSizeError)
    })

    it('check create', async () => {
      const uploadId = faker.string.uuid()
      const ownerId = faker.string.uuid()
      const name = faker.system.commonFileName('png')
      const filename = `${uploadId}.png`
      const size = faker.number.int({ min: 1, max: 99 })

      const upload = new Upload().create(uploadId, ownerId, fakeBucket, name, size)

      const events = upload.getUncommittedEvents()

      assert.equal(events.length, 1)
      assert.ok(events[0] instanceof UploadCreatedEvent)

      assertContains(events[0], { uploadId, ownerId, filename, name, size })

      assertContains(upload, { id: uploadId, ownerId, filename, name, size })
    })
  })

  describe('prepare', () => {
    it('check prepare', async () => {
      const url = faker.image.url()

      const upload = new Upload().create(
        faker.string.uuid(),
        faker.string.uuid(),
        fakeBucket,
        faker.system.commonFileName('png'),
        faker.number.int({ min: 1, max: 99 })
      )

      upload.commit()
      upload.prepare(url)

      const events = upload.getUncommittedEvents()

      assert.equal(events.length, 1)
      assert.ok(events[0] instanceof UploadPreparedEvent)

      assertContains(events[0], { uploadId: upload.id, url })

      assertContains(upload, { url })
    })
  })

  describe('confirm', () => {
    it('check url', async () => {
      assert.throws(() => {
        new Upload().confirm(faker.string.uuid(), fakeMetadata)
      }, UploadNotReadyError)
    })

    it('check match initiator', async () => {
      const upload = new Upload()
        .create(
          faker.string.uuid(),
          faker.string.uuid(),
          fakeBucket,
          faker.system.commonFileName('png'),
          faker.number.int({ min: 1, max: 99 })
        )
        .prepare(faker.image.url())

      assert.throws(() => {
        upload.confirm(faker.string.uuid(), fakeMetadata)
      }, UploadInitiatorDoesNotMatch)
    })

    it('check file uploaded', async () => {
      const upload = new Upload()
        .create(
          faker.string.uuid(),
          faker.string.uuid(),
          fakeBucket,
          faker.system.commonFileName('png'),
          faker.number.int({ min: 1, max: 99 })
        )
        .prepare(faker.image.url())

      assert.throws(() => {
        upload.confirm(upload.ownerId, undefined as never as StorageFileMetadata)
      }, FileNotUploadedError)
    })

    it('check confirm', async () => {
      const upload = new Upload()
        .create(
          faker.string.uuid(),
          faker.string.uuid(),
          fakeBucket,
          faker.system.commonFileName('png'),
          faker.number.int({ min: 1, max: 99 })
        )
        .prepare(faker.image.url())

      upload.commit()
      upload.confirm(
        upload.ownerId,
        StorageFileMetadata.create(faker.image.url(), 206, 'image/png')
      )

      const events = upload.getUncommittedEvents()

      assert.equal(events.length, 1)
      assert.ok(events[0] instanceof UploadConfirmedEvent)

      assertContains(events[0], { uploadId: upload.id })

      assertContains(upload, { confirmed: true })
    })

    it('check already confirmed', async () => {
      const upload = new Upload()
        .create(
          faker.string.uuid(),
          faker.string.uuid(),
          fakeBucket,
          faker.system.commonFileName('png'),
          faker.number.int({ min: 1, max: 99 })
        )
        .prepare(faker.image.url())

      upload.confirm(upload.ownerId, fakeMetadata)

      assert.throws(() => {
        upload.confirm(upload.ownerId, fakeMetadata)
      }, UploadAlreadyConfirmedError)
    })
  })
})
