import type { ICommandHandler } from '@nestjs/cqrs'

import { CommandHandler }       from '@nestjs/cqrs'

import { UploadRepository }     from '@files/domain-module'

import { CreateUploadCommand }  from '../commands'

@CommandHandler(CreateUploadCommand)
export class CreateUploadCommandHandler implements ICommandHandler<CreateUploadCommand, void> {
  constructor(private readonly uploadRepository: UploadRepository) {}

  async execute(command: CreateUploadCommand): Promise<void> {
    const upload = this.uploadRepository.create()

    await upload.create(command.id, command.initiatorId, command.bucket, command.name, command.size)

    await this.uploadRepository.save(upload)
  }
}
