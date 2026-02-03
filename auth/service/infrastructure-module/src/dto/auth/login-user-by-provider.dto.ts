import { IsEnum }                          from 'class-validator'
import { IsNotEmpty }                      from 'class-validator'
import { IsString }                        from 'class-validator'

import { ProviderType as RpcProviderType } from '@alts/auth-rpc/abstractions'
import { ProviderType as ProviderTypeDto } from '@alts/auth-rpc/interfaces'

export class LoginUserByProviderDto {
  @IsEnum(RpcProviderType)
  provider: ProviderTypeDto

  @IsString()
  @IsNotEmpty()
  idToken: string

  @IsString()
  @IsNotEmpty()
  nonce: string
}
