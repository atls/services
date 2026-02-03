import type { AuthToken } from '../../types/index.js'

export class GetUserAccountQuery {
  constructor(public readonly sessionToken: AuthToken) {}
}
