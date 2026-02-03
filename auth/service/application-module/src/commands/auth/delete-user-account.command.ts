import type { UserAccount } from '@auth/domain-module'

export class DeleteUserAccountCommand {
  constructor(public readonly accountId: UserAccount['id']) {}
}
