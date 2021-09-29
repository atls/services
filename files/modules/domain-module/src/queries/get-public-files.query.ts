interface Pager {
  take: number
  offset: number
}

export class GetPublicFilesQuery {
  constructor(
    public readonly pager: Pager = { take: 100, offset: 0 },
    public readonly query?,
    public readonly order?
  ) {}
}
