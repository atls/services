import { Field }      from '@nestjs/graphql'
import { ID }         from '@nestjs/graphql'
import { ObjectType } from '@nestjs/graphql'

@ObjectType()
export class File {
  @Field(() => ID)
  id!: string

  @Field()
  url!: string

  @Field()
  ownerId!: string
}
