import type { AuthProvider } from '../../types/index.js'

export class LoginUserByProviderCommand {
  constructor(
    public readonly provider: AuthProvider,
    public readonly idToken: string,
    public readonly nonce: string
  ) {}
}
