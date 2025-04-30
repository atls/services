import { Field }      from '@nestjs/graphql'
import { ID }         from '@nestjs/graphql'
import { ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ValidationErrorType {
  @Field(() => ID)
  id!: string

  @Field()
  message!: string
}
