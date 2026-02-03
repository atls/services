import type { ICommandHandler } from '@nestjs/cqrs'

import { CommandHandler }       from '@nestjs/cqrs'

import { UploadRepository }     from '@files-engine/domain-module'
import { FilesBucketsAdapter }  from '@files-engine/domain-module'
import { FilesStorageAdapter }  from '@files-engine/domain-module'
import { Upload }               from '@files-engine/domain-module'

import { CreateUploadCommand }  from '../commands/index.js'

@CommandHandler(CreateUploadCommand)
export class CreateUploadCommandHandler implements ICommandHandler<CreateUploadCommand, void> {
  constructor(
    private readonly uploadRepository: UploadRepository,
    private readonly bucketsAdapter: FilesBucketsAdapter,
    private readonly storageAdapter: FilesStorageAdapter
  ) {}

  async execute(command: CreateUploadCommand): Promise<void> {
    const bucket = await this.bucketsAdapter.toFilesBucket(command.bucket)

    const upload = new Upload().create(
      command.uploadId,
      command.initiatorId,
      bucket!,
      command.name,
      command.size
    )

    await this.uploadRepository.save(
      upload.prepare(await this.storageAdapter.prepareUpload(upload))
    )
  }
}
