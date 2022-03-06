import { CommandHandler }       from '@nestjs/cqrs'
import { ICommandHandler }      from '@nestjs/cqrs'

import assert                   from 'assert'

import { UploadRepository }     from '@files/domain-module'
import { FileRepository }       from '@files/domain-module'

import { ConfirmUploadCommand } from '../commands'

@CommandHandler(ConfirmUploadCommand)
export class ConfirmUploadCommandHandler implements ICommandHandler<ConfirmUploadCommand, void> {
  constructor(
    private readonly uploadRepository: UploadRepository,
    private readonly fileRepository: FileRepository
  ) {}

  async execute(command: ConfirmUploadCommand): Promise<void> {
    const upload = await this.uploadRepository.findById(command.id)

    assert.ok(upload, 'Upload not found.')

    const file = await upload.confirm(command.confirmatorId)

    await this.uploadRepository.save(upload)
    await this.fileRepository.save(file)
  }
}
