import type { ArgumentsHost }         from '@nestjs/common'
import type { Observable }            from 'rxjs'

import { AssertionError }             from 'node:assert'

import { DomainError }                from '@atls/core-errors'
import { ValidationError }            from '@atls/nestjs-validation'
import { ConnectError }               from '@connectrpc/connect'
import { Catch }                      from '@nestjs/common'
import { BaseRpcExceptionFilter }     from '@nestjs/microservices'
import { RpcException }               from '@nestjs/microservices'
import { assertionExceptionFactory }  from '@atls/nestjs-connectrpc-errors'
import { validationExceptionFactory } from '@atls/nestjs-connectrpc-errors'
import { domainExceptionFactory }     from '@atls/nestjs-connectrpc-errors'

import { KratosAuthException }        from '../exceptions/index.js'
import { kratosExceptionFactory }     from '../exception-factories/index.js'

@Catch()
export class ConnectRpcExceptionsFilter extends BaseRpcExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override catch(exception: unknown, host: ArgumentsHost): Observable<any> {
    if (exception instanceof AssertionError) {
      return super.catch(this.wrapToRpcException(assertionExceptionFactory(exception)), host)
    }

    if (exception instanceof DomainError) {
      return super.catch(this.wrapToRpcException(domainExceptionFactory(exception)), host)
    }

    if (exception instanceof ValidationError) {
      return super.catch(
        this.wrapToRpcException(validationExceptionFactory(exception.errors)),
        host
      )
    }

    if (exception instanceof KratosAuthException) {
      return super.catch(this.wrapToRpcException(kratosExceptionFactory(exception)), host)
    }

    return super.catch(this.wrapToRpcException(exception), host)
  }

  private wrapToRpcException(exception: unknown): unknown {
    if (exception instanceof RpcException) {
      return exception
    }

    if (exception instanceof ConnectError) {
      return new RpcException(exception)
    }

    return exception
  }
}
