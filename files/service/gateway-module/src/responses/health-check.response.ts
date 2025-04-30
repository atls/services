import { Field }      from '@nestjs/graphql'
import { ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HealthCheckResponse {
  @Field(() => String)
  status: string

  @Field(() => Number)
  timestamp: number
}
