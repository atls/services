interface Pager {
  take: number
  offset: number
}

export class GetOwnedFilesQuery {
  constructor(
    public readonly ownerId: string,
    public readonly pager: Pager = { take: 100, offset: 0 },
    public readonly query?,
    public readonly order?
  ) {}
}
