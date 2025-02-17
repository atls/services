import { CommandHandler }      from '@files/cqrs-adapter'
import { ICommandHandler }     from '@files/cqrs-adapter'
import { UploadRepository }    from '@files/domain-module'

import { CreateUploadCommand } from '../commands/index.js'
import { CommandException }    from '../exceptions/index.js'

@CommandHandler(CreateUploadCommand)
export class CreateUploadCommandHandler implements ICommandHandler<CreateUploadCommand, void> {
  constructor(private readonly uploadRepository: UploadRepository) {}

  async execute(command: CreateUploadCommand): Promise<void> {
    try {
      const upload = this.uploadRepository.create()

      await upload.create(
        command.id,
        command.initiatorId,
        command.bucket,
        command.name,
        command.size
      )

      await this.uploadRepository.save(upload)
    } catch (error) {
      throw new CommandException(CreateUploadCommandHandler.name, command, error)
    }
  }
}
