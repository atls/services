import { Query }               from '@nestjs/graphql'
import { Resolver }            from '@nestjs/graphql'

import { HealthCheckResponse } from '../responses/index.js'

@Resolver()
export class HealthQueries {
  @Query(() => HealthCheckResponse)
  healthCheck(): HealthCheckResponse {
    return {
      status: 'OK',
      timestamp: Date.now(),
    }
  }
}
