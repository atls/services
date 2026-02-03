import type { ConfirmLoginCodeRequest }         from '@alts/auth-rpc/interfaces'
import type { ConfirmLoginCodeResponse }        from '@alts/auth-rpc/interfaces'
import type { ConfirmRecoveryCodeRequest }      from '@alts/auth-rpc/interfaces'
import type { ConfirmRecoveryCodeResponse }     from '@alts/auth-rpc/interfaces'
import type { ConfirmVerificationCodeRequest }  from '@alts/auth-rpc/interfaces'
import type { ConfirmVerificationCodeResponse } from '@alts/auth-rpc/interfaces'
import type { DeleteUserAccountRequest }        from '@alts/auth-rpc/interfaces'
import type { DeleteUserAccountResponse }       from '@alts/auth-rpc/interfaces'
import type { GetUserAccountRequest }           from '@alts/auth-rpc/interfaces'
import type { GetUserAccountResponse }          from '@alts/auth-rpc/interfaces'
import type { LoginUserByEmailRequest }         from '@alts/auth-rpc/interfaces'
import type { LoginUserByEmailResponse }        from '@alts/auth-rpc/interfaces'
import type { LoginUserByPhoneRequest }         from '@alts/auth-rpc/interfaces'
import type { LoginUserByPhoneResponse }        from '@alts/auth-rpc/interfaces'
import type { RegisterUserByEmailRequest }      from '@alts/auth-rpc/interfaces'
import type { RegisterUserByEmailResponse }     from '@alts/auth-rpc/interfaces'
import type { RegisterUserByPhoneRequest }      from '@alts/auth-rpc/interfaces'
import type { RegisterUserByPhoneResponse }     from '@alts/auth-rpc/interfaces'
import type { LoginUserByProviderRequest }      from '@alts/auth-rpc/interfaces'
import type { LoginUserByProviderResponse }     from '@alts/auth-rpc/interfaces'
import type { SendRecoveryCodeRequest }         from '@alts/auth-rpc/interfaces'
import type { SendRecoveryCodeResponse }        from '@alts/auth-rpc/interfaces'
import type { SendVerificationCodeRequest }     from '@alts/auth-rpc/interfaces'
import type { SendVerificationCodeResponse }    from '@alts/auth-rpc/interfaces'
import type { UpdateUserEmailRequest }          from '@alts/auth-rpc/interfaces'
import type { UpdateUserEmailResponse }         from '@alts/auth-rpc/interfaces'
import type { UpdateUserPasswordRequest }       from '@alts/auth-rpc/interfaces'
import type { UpdateUserPasswordResponse }      from '@alts/auth-rpc/interfaces'
import type { AuthProvider }                    from '@auth/application-module'
import type { ServiceImpl }                     from '@connectrpc/connect'

import { ConnectRpcService }                    from '@atls/nestjs-connectrpc'
import { ConnectRpcMethod }                     from '@atls/nestjs-connectrpc'
import { UseFilters }                           from '@nestjs/common'
import { Controller }                           from '@nestjs/common'

import { ProviderType as RpcProviderType }      from '@alts/auth-rpc/abstractions'
import { AuthService }                          from '@alts/auth-rpc/connect'
import { ProviderType }                         from '@alts/auth-rpc/interfaces'
import { ConfirmLoginCodeCommand }              from '@auth/application-module'
import { ConfirmRecoveryCodeCommand }           from '@auth/application-module'
import { ConfirmVerificationCodeCommand }       from '@auth/application-module'
import { DeleteUserAccountCommand }             from '@auth/application-module'
import { GetUserAccountQuery }                  from '@auth/application-module'
import { LoginUserByEmailCommand }              from '@auth/application-module'
import { LoginUserByPhoneCommand }              from '@auth/application-module'
import { RegisterUserByEmailCommand }           from '@auth/application-module'
import { RegisterUserByPhoneCommand }           from '@auth/application-module'
import { LoginUserByProviderCommand }           from '@auth/application-module'
import { SendRecoveryCodeCommand }              from '@auth/application-module'
import { SendVerificationCodeCommand }          from '@auth/application-module'
import { UpdateUserEmailCommand }               from '@auth/application-module'
import { UpdateUserPasswordCommand }            from '@auth/application-module'
import { AuthRegistrationResponse }             from '@auth/application-module'
import { AuthSsoLoginResponse }                 from '@auth/application-module'
import { AuthProcess }                          from '@auth/domain-module'
import { UserAccount }                          from '@auth/domain-module'
import { UserSession }                          from '@auth/domain-module'

import { ConfirmLoginCodeDto }                  from '../dto/index.js'
import { ConfirmRecoveryCodeDto }               from '../dto/index.js'
import { ConfirmVerificationCodeDto }           from '../dto/index.js'
import { DeleteUserAccountDto }                 from '../dto/index.js'
import { GetUserAccountDto }                    from '../dto/index.js'
import { LoginUserByEmailDto }                  from '../dto/index.js'
import { LoginUserByPhoneDto }                  from '../dto/index.js'
import { RegisterUserByEmailDto }               from '../dto/index.js'
import { RegisterUserByPhoneDto }               from '../dto/index.js'
import { LoginUserByProviderDto }               from '../dto/index.js'
import { SendRecoveryCodeDto }                  from '../dto/index.js'
import { SendVerificationCodeDto }              from '../dto/index.js'
import { UpdateUserEmailDto }                   from '../dto/index.js'
import { UpdateUserPasswordDto }                from '../dto/index.js'
import { ConnectRpcExceptionsFilter }           from '../exception-filters/index.js'
import { ConnectRpcCommandHandler }             from '../handlers/index.js'
import { ConnectRpcQueryHandler }               from '../handlers/index.js'

@Controller()
@ConnectRpcService(AuthService)
@UseFilters(new ConnectRpcExceptionsFilter())
export class AuthController implements ServiceImpl<typeof AuthService> {
  constructor(
    private readonly commandHandler: ConnectRpcCommandHandler,
    private readonly queryHandler: ConnectRpcQueryHandler
  ) {}

  @ConnectRpcMethod()
  async loginUserByEmail(request: LoginUserByEmailRequest): Promise<LoginUserByEmailResponse> {
    return this.commandHandler.handle(
      request,
      LoginUserByEmailDto,
      (dto) =>
        new LoginUserByEmailCommand(
          dto.email,
          dto.password,
          dto.authProcessId ? AuthProcess.login({ id: dto.authProcessId }) : undefined
        ),
      (session: UserSession) => ({ sessionToken: session.getToken() })
    )
  }

  @ConnectRpcMethod()
  async registerUserByEmail(
    request: RegisterUserByEmailRequest
  ): Promise<RegisterUserByEmailResponse> {
    return this.commandHandler.handle(
      request,
      RegisterUserByEmailDto,
      (dto) => new RegisterUserByEmailCommand(dto.email, dto.password),
      ({ authProcess, userSession }: AuthRegistrationResponse) => ({
        authProcessId: authProcess.getId(),
        sessionToken: userSession.getToken(),
        accountId: userSession.getAccount()?.getId() || '',
      })
    )
  }

  @ConnectRpcMethod()
  async loginUserByPhone(request: LoginUserByPhoneRequest): Promise<LoginUserByPhoneResponse> {
    return this.commandHandler.handle(
      request,
      LoginUserByPhoneDto,
      (dto) => new LoginUserByPhoneCommand(dto.phone),
      (process: AuthProcess) => ({ authProcessId: process.getId() })
    )
  }

  @ConnectRpcMethod()
  async registerUserByPhone(
    request: RegisterUserByPhoneRequest
  ): Promise<RegisterUserByPhoneResponse> {
    return this.commandHandler.handle(
      request,
      RegisterUserByPhoneDto,
      (dto) => new RegisterUserByPhoneCommand(dto.phone),
      ({ authProcess, userSession }: AuthRegistrationResponse) => ({
        authProcessId: authProcess.getId(),
        sessionToken: userSession.getToken(),
        accountId: userSession.getAccount()?.getId() || '',
      })
    )
  }

  @ConnectRpcMethod()
  async loginUserByProvider(
    request: LoginUserByProviderRequest
  ): Promise<LoginUserByProviderResponse> {
    return this.commandHandler.handle(
      request,
      LoginUserByProviderDto,
      (dto) =>
        new LoginUserByProviderCommand(
          this.mapProviderFromRpc(dto.provider),
          dto.idToken,
          dto.nonce
        ),
      ({ authProcess, userSession }: AuthSsoLoginResponse) => ({
        authProcessId: authProcess?.getId(),
        sessionToken: userSession?.getToken(),
        accountId: userSession?.getAccount()?.getId(),
      })
    )
  }

  @ConnectRpcMethod()
  async confirmLoginCode(request: ConfirmLoginCodeRequest): Promise<ConfirmLoginCodeResponse> {
    return this.commandHandler.handle(
      request,
      ConfirmLoginCodeDto,
      (dto) =>
        new ConfirmLoginCodeCommand(
          AuthProcess.login({ id: dto.authProcessId }),
          dto.code,
          dto.identifier
        ),
      (session: UserSession) => ({ sessionToken: session.getToken() })
    )
  }

  @ConnectRpcMethod()
  async sendRecoveryCode(request: SendRecoveryCodeRequest): Promise<SendRecoveryCodeResponse> {
    return this.commandHandler.handle(
      request,
      SendRecoveryCodeDto,
      (dto) => new SendRecoveryCodeCommand(dto.email),
      (process: AuthProcess) => ({ authProcessId: process.getId() })
    )
  }

  @ConnectRpcMethod()
  async confirmRecoveryCode(
    request: ConfirmRecoveryCodeRequest
  ): Promise<ConfirmRecoveryCodeResponse> {
    return this.commandHandler.handle(
      request,
      ConfirmRecoveryCodeDto,
      (dto) =>
        new ConfirmRecoveryCodeCommand(AuthProcess.recovery({ id: dto.authProcessId }), dto.code),
      (session: UserSession) => ({ sessionToken: session.getToken() })
    )
  }

  @ConnectRpcMethod()
  async sendVerificationCode(
    request: SendVerificationCodeRequest
  ): Promise<SendVerificationCodeResponse> {
    return this.commandHandler.handle(
      request,
      SendVerificationCodeDto,
      (dto) => new SendVerificationCodeCommand(dto.email),
      (process: AuthProcess) => ({ authProcessId: process.getId() })
    )
  }

  @ConnectRpcMethod()
  async confirmVerificationCode(
    request: ConfirmVerificationCodeRequest
  ): Promise<ConfirmVerificationCodeResponse> {
    return this.commandHandler.handle(
      request,
      ConfirmVerificationCodeDto,
      (dto) =>
        new ConfirmVerificationCodeCommand(
          AuthProcess.verification({ id: dto.authProcessId }),
          dto.code
        ),
      () => ({ success: true })
    )
  }

  @ConnectRpcMethod()
  async updateUserEmail(request: UpdateUserEmailRequest): Promise<UpdateUserEmailResponse> {
    return this.commandHandler.handle(
      request,
      UpdateUserEmailDto,
      (dto) => new UpdateUserEmailCommand(dto.email, dto.sessionToken),
      (process: AuthProcess) => ({ authProcessId: process.getId() })
    )
  }

  @ConnectRpcMethod()
  async updateUserPassword(
    request: UpdateUserPasswordRequest
  ): Promise<UpdateUserPasswordResponse> {
    return this.commandHandler.handle(
      request,
      UpdateUserPasswordDto,
      (dto) => new UpdateUserPasswordCommand(dto.password, dto.sessionToken),
      () => ({ success: true })
    )
  }

  @ConnectRpcMethod()
  async deleteUserAccount(request: DeleteUserAccountRequest): Promise<DeleteUserAccountResponse> {
    return this.commandHandler.handle(
      request,
      DeleteUserAccountDto,
      (dto) => new DeleteUserAccountCommand(dto.accountId),
      () => ({ success: true })
    )
  }

  @ConnectRpcMethod()
  async getUserAccount(request: GetUserAccountRequest): Promise<GetUserAccountResponse> {
    return this.queryHandler.handle(
      request,
      GetUserAccountDto,
      (dto) => new GetUserAccountQuery(dto.sessionToken),
      (userAccount: UserAccount) => userAccount.toDTO()
    )
  }

  private mapProviderFromRpc(provider: ProviderType): AuthProvider {
    switch (provider) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      case RpcProviderType.GOOGLE:
        return 'google'
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      case RpcProviderType.APPLE:
        return 'apple'
      default:
        throw new Error(`Unsupported provider type: ${provider}`)
    }
  }
}
