export class ConfirmUploadCommand {
  constructor(
    public readonly id: string,
    public readonly confirmatorId: string
  ) {}
}
