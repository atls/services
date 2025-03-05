import assert                   from 'assert'

import { CommandHandler }       from '@files/cqrs-adapter'
import { ICommandHandler }      from '@files/cqrs-adapter'
import { UploadRepository }     from '@files/domain-module'
import { FileRepository }       from '@files/domain-module'

import { ConfirmUploadCommand } from '../commands/index.js'
import { CommandException }     from '../exceptions/index.js'
import { NotFoundException }    from '../exceptions/index.js'

@CommandHandler(ConfirmUploadCommand)
export class ConfirmUploadCommandHandler implements ICommandHandler<ConfirmUploadCommand, void> {
  constructor(
    private readonly uploadRepository: UploadRepository,
    private readonly fileRepository: FileRepository
  ) {}

  async execute(command: ConfirmUploadCommand): Promise<void> {
    try {
      const upload = await this.uploadRepository.findById(command.id)

      assert.ok(upload, new NotFoundException('Upload', command))

      const file = await upload.confirm(command.confirmatorId)

      await this.uploadRepository.save(upload)
      await this.fileRepository.save(file)
    } catch (error) {
      throw new CommandException(ConfirmUploadCommandHandler.name, command, error)
    }
  }
}
