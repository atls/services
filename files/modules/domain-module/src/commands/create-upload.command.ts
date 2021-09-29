import { TargetAggregateIdentifier } from '@typa/common'

export class CreateUploadCommand {
  constructor(
    @TargetAggregateIdentifier public readonly uploadId: string,
    public readonly initiatorId: string,
    public readonly bucket: string,
    public readonly name: string,
    public readonly size: number
  ) {}
}
