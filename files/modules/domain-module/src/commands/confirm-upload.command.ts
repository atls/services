import { TargetAggregateIdentifier } from '@typa/common'

export class ConfirmUploadCommand {
  constructor(
    @TargetAggregateIdentifier public readonly uploadId: string,
    public readonly confirmatorId: string
  ) {}
}
