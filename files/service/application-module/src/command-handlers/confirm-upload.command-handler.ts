import type { ICommandHandler }    from '@nestjs/cqrs'

import assert                      from 'node:assert'

import { CommandHandler }          from '@nestjs/cqrs'

import { TransactionalRepository } from '@files-engine/domain-module'
import { UploadRepository }        from '@files-engine/domain-module'
import { FilesStorageAdapter }     from '@files-engine/domain-module'

import { ConfirmUploadCommand }    from '../commands/index.js'

@CommandHandler(ConfirmUploadCommand)
export class ConfirmUploadCommandHandler implements ICommandHandler<ConfirmUploadCommand, void> {
  constructor(
    private readonly transactionalRepository: TransactionalRepository,
    private readonly uploadRepository: UploadRepository,
    private readonly storageAdapter: FilesStorageAdapter
  ) {}

  async execute(command: ConfirmUploadCommand): Promise<void> {
    const upload = await this.uploadRepository.findById(command.uploadId)

    assert.ok(upload, `Upload with id '${command.uploadId}' not found`)

    const metadata = await this.storageAdapter.toFileMetadata(upload)

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const file = await upload.confirm(command.ownerId, metadata!)

    await this.transactionalRepository.saveUploadAndFile(upload, file)
  }
}
