import type { KratosAuthException } from '../exceptions/index.js'

import { Code }                     from '@connectrpc/connect'
import { ConnectError }             from '@connectrpc/connect'
import { RpcException }             from '@nestjs/microservices'

import { extractKratosError }       from '../utils/index.js'

export const kratosExceptionFactory = (exception: KratosAuthException): RpcException => {
  const { message, details } = extractKratosError(exception.cause)

  const errorParts = [exception.message, message, details]

  const errorMessage = errorParts.filter(Boolean).join('. ')

  return new RpcException(new ConnectError(errorMessage, Code.Unauthenticated))
}
